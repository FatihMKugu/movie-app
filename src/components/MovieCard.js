import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';

const MovieCard = ({ movie, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
        style={styles.image}
        resizeMode="cover"
      />
      <Text numberOfLines={1} style={styles.title}>
        {movie.title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 5,
    maxWidth: '31%', // %33 olursa sonuncu taşar
    alignItems: 'center',
  },
  image: {
    width: '100%',
    aspectRatio: 2 / 3, // dik afiş için ideal
    borderRadius: 8,
  },
  title: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default MovieCard;
