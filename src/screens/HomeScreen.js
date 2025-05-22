import React, { useEffect, useState } from 'react';
import { 
  View, Text, FlatList, ActivityIndicator, StyleSheet, 
  TouchableOpacity, Modal, Pressable, ScrollView 
} from 'react-native';
import { fetchPopularMovies, fetchGenres, fetchMoviesByGenre } from '../api/tmdb';
import MovieCard from '../components/MovieCard';

const HomeScreen = ({ navigation }) => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [loading, setLoading] = useState(true);
  const [genreModalVisible, setGenreModalVisible] = useState(false);

  const loadPopular = async () => {
    const data = await fetchPopularMovies();
    setMovies(data);
  };

  const loadGenres = async () => {
    const data = await fetchGenres();
    setGenres(data);
  };

  const loadByGenre = async (genreId) => {
    const data = await fetchMoviesByGenre(genreId);
    setMovies(data);
  };

  useEffect(() => {
    loadGenres();
    loadPopular().then(() => setLoading(false));
  }, []);

  const padListToFullRow = (list, columns = 3) => {
    const remainder = list.length % columns;
    if (remainder === 0) return list;
    const padding = Array.from({ length: columns - remainder }, (_, i) => ({
      id: `placeholder-${i}`,
      placeholder: true,
    }));
    return [...list, ...padding];
  };

  const onGenreSelect = async (genre) => {
    setGenreModalVisible(false);
    setSelectedGenre(genre);
    setLoading(true);
    if (genre) {
      await loadByGenre(genre.id);
    } else {
      await loadPopular();
    }
    setLoading(false);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="blue" style={{ marginTop: 40 }} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>
          {selectedGenre ? `${selectedGenre.name} Filmleri` : 'Popüler Filmler'}
        </Text>
        <TouchableOpacity onPress={() => setGenreModalVisible(true)} style={styles.filterButton}>
          <Text style={styles.filterText}>Tür Seç</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        key={'grid'}
        data={padListToFullRow(movies)}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        renderItem={({ item }) => (
          item.placeholder ? <View style={{ flex: 1, margin: 5 }} /> : (
            <MovieCard
              movie={item}
              onPress={() => navigation.navigate('MovieDetail', { movie: item })}
            />
          )
        )}
        columnWrapperStyle={styles.row}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <Modal visible={genreModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Film Türü Seç</Text>

            <ScrollView style={{ maxHeight: 300 }}>
              <Pressable onPress={() => onGenreSelect(null)}>
                <Text style={styles.genreItem}>Popüler Filmler</Text>
              </Pressable>

              {genres.map((genre) => (
                <Pressable key={genre.id} onPress={() => onGenreSelect(genre)}>
                  <Text style={styles.genreItem}>{genre.name}</Text>
                </Pressable>
              ))}
            </ScrollView>

            <Pressable onPress={() => setGenreModalVisible(false)} style={styles.modalClose}>
              <Text style={{ fontWeight: 'bold' }}>Kapat</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 8, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold' },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 4,
  },
  filterButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  filterText: {
    color: 'white',
    fontSize: 14,
  },
  row: { justifyContent: 'space-between' },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    marginHorizontal: 20,    // 40'tan 20'ye indirildi, daha geniş oldu
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    elevation: 5,
    maxHeight: '85%',        // Önce 70%'di, şimdi 85% yaptım, daha uzun
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  genreItem: {
    fontSize: 16,
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
  },
  modalClose: {
    marginTop: 10,
    alignItems: 'center',
  },
});


export default HomeScreen;
