import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MovieDetailScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Film İçerik Sayfası</Text>
      <Text>Filmle ilgili detaylar</Text>
      <Text>Oyuncu Bilgisi: </Text>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
});

export default MovieDetailScreen;
