import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar
} from 'react-native';
import { FavoritesContext } from '../context/FavoritesContext';
import MovieCard from '../components/MovieCard';
import { SafeAreaView } from 'react-native-safe-area-context';

const FavoritesScreen = ({ navigation }) => {
  const { favorites, watchlist } = useContext(FavoritesContext);
  const [activeTab, setActiveTab] = useState('favorites');
  const data = activeTab === 'watchlist' ? watchlist : favorites;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.tabRow}>
          <TouchableOpacity
            onPress={() => setActiveTab('favorites')}
            style={[styles.tabButton, activeTab === 'favorites' && styles.activeTab]}
          >
            <Text style={styles.tabText}>Favorilerim</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('watchlist')}
            style={[styles.tabButton, activeTab === 'watchlist' && styles.activeTab]}
          >
            <Text style={styles.tabText}>İzlemek İstediklerim</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3}
          renderItem={({ item }) => (
            <MovieCard movie={item} onPress={() => navigation.navigate('MovieDetail', { movie: item })} />
          )}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
  },
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 12,
  },
  tabButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#ddd',
    borderRadius: 6,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default FavoritesScreen;