import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Image,
    SafeAreaView,
    Platform,
    StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { searchMovies } from '../api/tmdb';

const SearchScreen = ({ navigation }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    const handleSearch = async () => {
        if (query.trim() === '') return;
        const data = await searchMovies(query);
        setResults(data);
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('MovieDetail', { movie: item })}
        >
            <Image
                source={{
                    uri: item.poster_path
                        ? `https://image.tmdb.org/t/p/w185${item.poster_path}`
                        : 'https://via.placeholder.com/100x150?text=No+Image',
                }}
                style={styles.poster}
            />
            <View style={styles.info}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.date}>{item.release_date?.split('-')[0]}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.searchContainer}>
                    <TextInput
                        placeholder="Film ara..."
                        value={query}
                        onChangeText={setQuery}
                        style={styles.input}
                        placeholderTextColor="#999"
                    />
                    {query.length > 0 && (
                        <TouchableOpacity onPress={() => setQuery('')} style={styles.clearButton}>
                            <Ionicons name="close-circle" size={20} color="#999" />
                        </TouchableOpacity>
                    )}
                </View>
                <Button title="Ara" onPress={handleSearch} />
                <FlatList
                    data={results}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    container: { flex: 1, padding: 16, backgroundColor: '#fff' },
    list: {
        paddingTop: 12,
    },
    card: {
        flexDirection: 'row',
        marginBottom: 12,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        overflow: 'hidden',
    },
    poster: {
        width: 100,
        height: 150,
    },
    info: {
        flex: 1,
        padding: 10,
        justifyContent: 'center',
    },
    title: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    date: {
        color: '#777',
        marginTop: 4,
    },
    searchContainer: {
        position: 'relative',
        marginBottom: 12,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 15,
        fontSize: 16,
        color: '#000',
    },
    clearButton: {
        position: 'absolute',
        right: 12,
        top: '50%',
        transform: [{ translateY: -10 }],
    }
});

export default SearchScreen;