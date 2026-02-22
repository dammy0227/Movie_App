// services/movieService.js
import API from "./api";

export const getTrendingMovies = async () => {
  const res = await API.get("/movies/trending");
  return res.data;
};

export const getPopularMovies = async () => {
  const res = await API.get("/movies/popular");
  return res.data;
};

export const getTopRatedMovies = async () => {
  const res = await API.get("/movies/top-rated");
  return res.data;
};

export const getNowPlayingMovies = async () => {
  const res = await API.get("/movies/now-playing");
  return res.data;
};

export const getUpcomingMovies = async () => {
  const res = await API.get("/movies/upcoming");
  return res.data;
};

export const searchMovies = async (query) => {
  const res = await API.get("/movies/search", { params: { query } });
  return res.data;
};

// FAST - only TMDB details (no sources, no OMDB, no AI)
export const getMovieDetails = async (tmdbId) => {
  const res = await API.get(`/movies/details/${tmdbId}`);
  return res.data;
};

// Separate function for OMDB ratings
export const getMovieOmdbRatings = async (imdbId) => {
  if (!imdbId) return {};
  const res = await API.get(`/movies/omdb/${imdbId}`);
  return res.data;
};

// Separate function for AI summary
export const getMovieAISummary = async (plot) => {
  if (!plot) return { summary: '' };
  const res = await API.post("/movies/ai-summary", { plot });
  return res.data;
};

// MovieBox sources only
export const getMovieSources = async (tmdbId) => {
  try {
    const res = await API.get(`/movies/sources/${tmdbId}`, {
      timeout: 8000 // 8 second timeout
    });
    return res.data;
  } catch (error) {
    console.error('Error fetching sources:', error);
    return { sources: [] }; // Return empty array on error
  }
};