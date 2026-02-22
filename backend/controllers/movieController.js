import { searchMovies, getMovieDetails, getTrendingMovies, getPopularMovies, getTopRatedMovies, getNowPlayingMovies, getUpcomingMovies } from "../utils/tmdbApi.js";
import { getMovieRatings } from "../utils/omdbApi.js";
import { getMovieSummary } from "../utils/cohereApi.js";
import { findMovieBoxId, getMovieBoxSources } from "../utils/movieboxApi.js";

export const searchMovie = async (req, res) => {
  try {
    const { query } = req.query;
    const results = await searchMovies(query);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const movieDetails = async (req, res) => {
  try {
    const { tmdbId } = req.params;
    const { omdbId, aiSummary, includeSources } = req.query;

    // Get TMDB data
    const tmdbData = await getMovieDetails(tmdbId);

    // Get OMDB ratings if requested
    let omdbData = {};
    if (omdbId || tmdbData.imdb_id) {
      const imdbId = omdbId || tmdbData.imdb_id;
      if (imdbId) {
        omdbData = await getMovieRatings(imdbId);
      }
    }

    // Get AI summary if requested
    let aiSummaryText = "";
    if (aiSummary === "true") {
      const plot = tmdbData.overview || tmdbData.title;
      aiSummaryText = await getMovieSummary(plot);
    }

    // Get MovieBox streaming sources if requested
    let movieboxSources = [];
    let movieboxInfo = null;
    
    if (includeSources === "true") {
      console.log(`Looking for MovieBox sources for TMDB ID: ${tmdbId}`);
      
      // Find matching MovieBox ID
      movieboxInfo = await findMovieBoxId(tmdbData);
      
      if (movieboxInfo) {
        console.log(`Found MovieBox match: ${movieboxInfo.title} (ID: ${movieboxInfo.id})`);
        
        // Get streaming sources
        movieboxSources = await getMovieBoxSources(movieboxInfo.id);
        console.log(`Found ${movieboxSources.length} sources`);
      } else {
        console.log('No MovieBox match found');
      }
    }

    // Combine all data
    res.json({ 
      ...tmdbData, 
      omdb: omdbData, 
      ai_summary: aiSummaryText,
      moviebox: movieboxInfo ? {
        id: movieboxInfo.id,
        title: movieboxInfo.title,
        type: movieboxInfo.type,
        sources: movieboxSources
      } : null
    });
    
  } catch (error) {
    console.error('Movie details error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Direct endpoint to get MovieBox sources for a TMDB movie
export const getMovieSources = async (req, res) => {
  try {
    const { tmdbId } = req.params;
    const { season, episode } = req.query;
    
    // Get TMDB data first to help with matching
    const tmdbData = await getMovieDetails(tmdbId);
    
    if (!tmdbData) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    
    // Find MovieBox ID
    const movieboxInfo = await findMovieBoxId(tmdbData);
    
    if (!movieboxInfo) {
      return res.status(404).json({ message: 'No streaming sources found for this movie' });
    }
    
    // Get sources
    const sources = await getMovieBoxSources(
      movieboxInfo.id, 
      season ? parseInt(season) : 0,
      episode ? parseInt(episode) : 0
    );
    
    res.json({
      tmdbId,
      movieboxId: movieboxInfo.id,
      title: movieboxInfo.title,
      sources: sources
    });
    
  } catch (error) {
    console.error('Get movie sources error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const trendingMovies = async (req, res) => {
  try {
    const movies = await getTrendingMovies();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const popularMovies = async (req, res) => {
  try {
    const movies = await getPopularMovies();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const topRatedMovies = async (req, res) => {
  try {
    const movies = await getTopRatedMovies();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const nowPlayingMovies = async (req, res) => {
  try {
    const movies = await getNowPlayingMovies();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const upcomingMovies = async (req, res) => {
  try {
    const movies = await getUpcomingMovies();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};