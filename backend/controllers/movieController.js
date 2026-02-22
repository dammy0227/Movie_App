// controllers/movieController.js
import { searchMovies, getMovieDetails, getTrendingMovies, getPopularMovies, getTopRatedMovies, getNowPlayingMovies, getUpcomingMovies } from "../utils/tmdbApi.js";
import { getMovieRatings } from "../utils/omdbApi.js";
import { getMovieSummary } from "../utils/cohereApi.js";
import { findMovieBoxId, getMovieBoxSources } from "../utils/movieboxApi.js";

// FAST endpoint - only TMDB data
export const movieDetails = async (req, res) => {
  try {
    const { tmdbId } = req.params;
    
    // Get TMDB data only - FAST!
    const tmdbData = await getMovieDetails(tmdbId);
    
    // Return just TMDB data immediately
    res.json(tmdbData);
    
  } catch (error) {
    console.error('Movie details error:', error);
    res.status(500).json({ message: error.message });
  }
};

// OMDB ratings endpoint (call separately)
export const movieOmdbRatings = async (req, res) => {
  try {
    const { imdbId } = req.params;
    
    if (!imdbId) {
      return res.json({});
    }
    
    const omdbData = await getMovieRatings(imdbId);
    res.json(omdbData);
    
  } catch (error) {
    console.error('OMDB ratings error:', error);
    res.json({});
  }
};

// AI Summary endpoint (call when user clicks)
export const movieAISummary = async (req, res) => {
  try {
    const { plot } = req.body;
    
    if (!plot) {
      return res.json({ summary: '' });
    }
    
    const summary = await getMovieSummary(plot);
    res.json({ summary });
    
  } catch (error) {
    console.error('AI summary error:', error);
    res.json({ summary: 'Summary unavailable' });
  }
};

// Optimized MovieBox sources endpoint (with timeout)
export const getMovieSources = async (req, res) => {
  try {
    const { tmdbId } = req.params;
    const { season, episode } = req.query;
    
    // Set timeout for the entire request
    const timeout = setTimeout(() => {
      if (!res.headersSent) {
        res.status(200).json({ sources: [] });
      }
    }, 8000);
    
    // Get TMDB data first
    const tmdbData = await getMovieDetails(tmdbId);
    
    if (!tmdbData) {
      clearTimeout(timeout);
      return res.status(200).json({ sources: [] });
    }
    
    // Find MovieBox ID - with its own timeout
    const movieboxInfo = await Promise.race([
      findMovieBoxId(tmdbData),
      new Promise(resolve => setTimeout(() => resolve(null), 5000))
    ]);
    
    if (!movieboxInfo) {
      clearTimeout(timeout);
      return res.status(200).json({ sources: [] });
    }
    
    // Get sources - with timeout
    const sources = await Promise.race([
      getMovieBoxSources(
        movieboxInfo.id, 
        season ? parseInt(season) : 0,
        episode ? parseInt(episode) : 0
      ),
      new Promise(resolve => setTimeout(() => resolve([]), 5000))
    ]);
    
    clearTimeout(timeout);
    
    res.json({
      tmdbId,
      movieboxId: movieboxInfo.id,
      title: movieboxInfo.title,
      sources: sources || []
    });
    
  } catch (error) {
    console.error('Get movie sources error:', error);
    // Always return 200 with empty sources to not break UI
    res.status(200).json({ sources: [] });
  }
};

// Search movies
export const searchMovie = async (req, res) => {
  try {
    const { query } = req.query;
    const results = await searchMovies(query);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Trending movies
export const trendingMovies = async (req, res) => {
  try {
    const movies = await getTrendingMovies();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Popular movies
export const popularMovies = async (req, res) => {
  try {
    const movies = await getPopularMovies();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Top rated movies
export const topRatedMovies = async (req, res) => {
  try {
    const movies = await getTopRatedMovies();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Now playing movies
export const nowPlayingMovies = async (req, res) => {
  try {
    const movies = await getNowPlayingMovies();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upcoming movies
export const upcomingMovies = async (req, res) => {
  try {
    const movies = await getUpcomingMovies();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};