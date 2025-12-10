const OMDB_API_KEY = "6f7e6e0c";
const API_BASE = "https://www.omdbapi.com/";

export const searchMovies = async (query, page = 1) => {
  try {
    const res = await fetch(`${API_BASE}?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(query)}&page=${page}`);
    return await res.json();
  } catch {
    return { Response: 'False', Error: 'Network error' };
  }
};

export const getMovieById = async (id) => {
  try {
    const res = await fetch(`${API_BASE}?apikey=${OMDB_API_KEY}&i=${id}&plot=full`);
    return await res.json();
  } catch {
    return null;
  }
};

export const fetchMovieByTitle = async (title) => {
  const res = await searchMovies(title, 1);
  if (res.Response === 'True' && res.Search?.[0]) {
    const full = await getMovieById(res.Search[0].imdbID);
    return full?.Response === 'True' ? full : res.Search[0];
  }
  return null;
};
