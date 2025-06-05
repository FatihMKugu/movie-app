import React, { useEffect, useState, useContext } from 'react';
import { View,Text,ScrollView,Image,StyleSheet,ActivityIndicator,Dimensions,TouchableOpacity,Platform,StatusBar} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MovieInfo from '../../assets/MovieInfo.png';
import { WebView } from 'react-native-webview';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {fetchMovieDetails,fetchMovieTrailer,fetchMovieCredits,} from '../api/tmdb';
import { FavoritesContext } from '../context/FavoritesContext';

const { width } = Dimensions.get('window');

const MovieDetailScreen = ({ route }) => {
  const { movie } = route.params;
  const [details, setDetails] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(true);

  const {
    favorites,
    watchlist,
    addFavorite,
    removeFavorite,
    addToWatchlist,
    removeFromWatchlist,
  } = useContext(FavoritesContext);

  const isFavorite = favorites.some((m) => m.id === movie.id);
  const isWatchlisted = watchlist.some((m) => m.id === movie.id);

  useEffect(() => {
    const load = async () => {
      const [detailData, trailerData, castData] = await Promise.all([
        fetchMovieDetails(movie.id),
        fetchMovieTrailer(movie.id),
        fetchMovieCredits(movie.id),
      ]);
      setDetails(detailData);
      setTrailer(trailerData);
      setCast(castData.slice(0, 10));
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="blue" style={{ marginTop: 40 }} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>{details?.title || 'Başlık yok'}</Text>

        {trailer ? (
          <WebView
            style={styles.video}
            javaScriptEnabled
            source={{ uri: `https://www.youtube.com/embed/${trailer.key}` }}
          />
        ) : (
          <Image
            source={MovieInfo}
            style={styles.noTrailerImage}
            resizeMode="cover"
          />
        )}

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              isFavorite ? styles.buttonActive : styles.buttonInactive,
            ]}
            onPress={() =>
              isFavorite ? removeFavorite(movie.id) : addFavorite(details)
            }
          >
            <Text style={styles.buttonText}>
              {isFavorite ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              isWatchlisted ? styles.buttonActive : styles.buttonInactive,
            ]}
            onPress={() =>
              isWatchlisted ? removeFromWatchlist(movie.id) : addToWatchlist(details)
            }
          >
            <Text style={styles.buttonText}>
              {isWatchlisted ? 'Listeden Çıkar' : 'İzlemek İstediklerime Ekle'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Yıl: </Text>
          <Text>{details?.release_date?.split('-')[0] || 'Bilinmiyor'}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Türler: </Text>
          <Text>
            {details?.genres?.length
              ? details.genres.map((g) => g.name).join(', ')
              : 'Bilgi yok'}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>IMDb: </Text>
          {details?.vote_average ? (
            <>
              <Ionicons name="star" size={16} color="#f1c40f" style={{ marginRight: 4 }} />
              <Text>{details.vote_average.toFixed(1)}</Text>
            </>
          ) : (
            <Text>Bilgi yok</Text>
          )}
        </View>

        <View style={styles.infoRowSubject}>
          <Text style={styles.label}>Konu:</Text>
          <Text style={styles.overview}>
            {details?.overview?.trim()
              ? details.overview
              : 'Filme ait konu bilgisi bulunamadı.'}
          </Text>
        </View>

        <Text style={[styles.label, { marginTop: 10 }]}>Oyuncular:</Text>
        {cast.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.castScroll}>
            {cast.map((actor) => (
              <View key={actor.id} style={styles.castCard}>
                <Image
                  source={{
                    uri: actor.profile_path
                      ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                      : 'https://via.placeholder.com/80x120?text=No+Image',
                  }}
                  style={styles.castImage}
                />
                <Text style={styles.castName} numberOfLines={1}>
                  {actor.name}
                </Text>
              </View>
            ))}
          </ScrollView>
        ) : (
          <Text>Oyuncu bilgisi bulunamadı.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: '#fff',
  },
  container: { flex: 1, padding: 12 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  video: {
    width: width - 24,
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 12,
  },
  infoRow: { flexDirection: 'row', marginBottom: 6, alignItems: 'center' },
  infoRowSubject: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 15,
    width: width - 60,
  },
  label: { fontWeight: 'bold', marginRight: 4 },
  overview: { fontSize: 14, marginTop: 1, flexShrink: 1, flexWrap: 'wrap' },
  castScroll: { marginTop: 8 },
  castCard: { width: 80, marginRight: 10, alignItems: 'center' },
  castImage: { width: 80, height: 120, borderRadius: 8, marginBottom: 4 },
  castName: { fontSize: 12, textAlign: 'center' },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginVertical: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonInactive: {
    backgroundColor: '#007bff',
  },
  buttonActive: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 14,
  },
  noTrailerImage: {
    width: width - 24,
    height: 200,
    borderRadius: 20,
    marginBottom: 12,
  },
});

export default MovieDetailScreen;