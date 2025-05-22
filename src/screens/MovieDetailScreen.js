import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {
  fetchMovieDetails,
  fetchMovieTrailer,
  fetchMovieCredits,
} from '../api/tmdb';

const { width } = Dimensions.get('window');

const MovieDetailScreen = ({ route }) => {
  const { movie } = route.params;
  const [details, setDetails] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [detailData, trailerData, castData] = await Promise.all([
        fetchMovieDetails(movie.id),
        fetchMovieTrailer(movie.id),
        fetchMovieCredits(movie.id),
      ]);
      setDetails(detailData);
      setTrailer(trailerData);
      setCast(castData.slice(0, 10)); // ilk 10 oyuncuyu al
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="blue" style={{ marginTop: 40 }} />;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{details.title}</Text>

      {trailer && (
        <WebView
          style={styles.video}
          javaScriptEnabled
          source={{ uri: `https://www.youtube.com/embed/${trailer.key}` }}
        />
      )}

      <View style={styles.infoRow}>
        <Text style={styles.label}>Yıl: </Text>
        <Text>{details.release_date?.split('-')[0]}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Türler: </Text>
        <Text>{details.genres.map(g => g.name).join(', ')}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>IMDb: </Text>
        <Text>{details.vote_average.toFixed(1)}</Text>
        <Ionicons name="star" size={16} color="#f1c40f" style={{ marginRight: 4}} />
            </View>


      <Text style={styles.label}>Konu:</Text>
      <Text style={styles.overview}>{details.overview}</Text>

      <Text style={[styles.label, { marginTop: 10 }]}>Oyuncular:</Text>
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  video: { width: width - 24, height: 200, borderRadius: 8, overflow: 'hidden', marginBottom: 12 },
  infoRow: { flexDirection: 'row', marginBottom: 6 },
  label: { fontWeight: 'bold', marginRight: 4 },
  overview: { fontSize: 14, marginTop: 4 },
  castScroll: { marginTop: 8 },
  castCard: { width: 80, marginRight: 10, alignItems: 'center' },
  castImage: { width: 80, height: 120, borderRadius: 8, marginBottom: 4 },
  castName: { fontSize: 12, textAlign: 'center' },
});

export default MovieDetailScreen;
