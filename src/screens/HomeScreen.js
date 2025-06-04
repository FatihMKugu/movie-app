import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { fetchPopularMovies, fetchMoviesByGenre, fetchGenres } from '../api/tmdb';
import MovieCard from '../components/MovieCard';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const genreData = await fetchGenres();
      setGenres(genreData);
      const movieData = await fetchPopularMovies();
      setMovies(movieData);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleGenreSelect = async (genreId) => {
    setLoading(true);
    setSelectedGenre(genreId);
    const data = genreId ? await fetchMoviesByGenre(genreId) : await fetchPopularMovies();
    setMovies(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="red" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {selectedGenre
            ? genres.find((g) => g.id === selectedGenre)?.name
            : 'Popüler Filmler'}
        </Text>
        <FlatList
          horizontal
          data={genres}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.genreList}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleGenreSelect(item.id)}
              style={[
                styles.genreButton,
                selectedGenre === item.id && styles.genreButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.genreText,
                  selectedGenre === item.id && styles.genreTextActive,
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <FlatList
        data={movies}
        numColumns={3}
        keyExtractor={(item) => item.id.toString()}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={styles.movieList}
        renderItem={({ item }) => (
          <MovieCard
            movie={item}
            onPress={() => navigation.navigate('MovieDetail', { movie: item })}
          />
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
  header: {
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  genreList: {
    paddingVertical: 6,
  },
  genreButton: {
    backgroundColor: '#eee',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
  },
  genreButtonActive: {
    backgroundColor: 'red',
  },
  genreText: {
    fontSize: 14,
    color: '#333',
  },
  genreTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  movieList: {
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;