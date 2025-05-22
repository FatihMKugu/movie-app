import axios from 'axios';

const TMDB_API_KEY = 'eb653865f5ad36beb342c293a6171526';
const BASE_URL = 'https://api.themoviedb.org/3';

export const fetchPopularMovies = async () => {
  const page1 = await axios.get(`${BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=tr-TR&page=1`);
  const page2 = await axios.get(`${BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=tr-TR&page=2`);

  const list1 = page1.data.results;
  const list2 = page2.data.results;

  const extra = list2.find(item2 => !list1.some(item1 => item1.id === item2.id));
  return [...list1, extra].filter(Boolean);
};

export const fetchGenres = async () => {
  const response = await axios.get(`${BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}&language=tr-TR`);
  return response.data.genres;
};

export const fetchMoviesByGenre = async (genreId) => {
  const page1 = await axios.get(`${BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=tr-TR&with_genres=${genreId}&page=1`);
  const page2 = await axios.get(`${BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=tr-TR&with_genres=${genreId}&page=2`);

  const list1 = page1.data.results;
  const list2 = page2.data.results;

  const extra = list2.find(item2 => !list1.some(item1 => item1.id === item2.id));
  return [...list1, extra].filter(Boolean);
};

export const fetchMovieDetails = async (movieId) => {
  const response = await axios.get(`${BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=tr-TR`);
  return response.data;
};

export const fetchMovieTrailer = async (movieId) => {
  const response = await axios.get(`${BASE_URL}/movie/${movieId}/videos?api_key=${TMDB_API_KEY}&language=en-US`);
  const trailers = response.data.results.filter(video => video.type === 'Trailer' && video.site === 'YouTube');
  return trailers.length > 0 ? trailers[0] : null;
};

export const fetchMovieCredits = async (movieId) => {
  const response = await axios.get(`${BASE_URL}/movie/${movieId}/credits?api_key=${TMDB_API_KEY}&language=tr-TR`);
  return response.data.cast;
};
