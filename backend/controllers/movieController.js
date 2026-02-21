import { searchMovies, getMovieDetails, getTrendingMovies, getPopularMovies, getTopRatedMovies, getNowPlayingMovies, getUpcomingMovies } from "../utils/tmdbApi.js";
import { getMovieRatings } from "../utils/omdbApi.js";
import { getMovieSummary } from "../utils/cohereApi.js";
<<<<<<< HEAD
import { findMovieBoxId, getMovieBoxSources } from "../utils/movieboxApi.js"; 
=======
>>>>>>> 9f79863cc8a29cab049d0bdaa7f586b2f5c9eb5f

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
<<<<<<< HEAD
    const { omdbId, aiSummary, includeSources } = req.query;

   
    const tmdbData = await getMovieDetails(tmdbId);

  
    let omdbData = {};
    if (omdbId || tmdbData.imdb_id) {
      const imdbId = omdbId || tmdbData.imdb_id;
      if (imdbId) {
        omdbData = await getMovieRatings(imdbId);
      }
    }

   
=======
    const { omdbId, aiSummary } = req.query;

    const tmdbData = await getMovieDetails(tmdbId);

    let omdbData = {};
    if (omdbId) {
      omdbData = await getMovieRatings(omdbId);
    }

>>>>>>> 9f79863cc8a29cab049d0bdaa7f586b2f5c9eb5f
    let aiSummaryText = "";
    if (aiSummary === "true") {
      const plot = tmdbData.overview || tmdbData.title;
      aiSummaryText = await getMovieSummary(plot);
    }

<<<<<<< HEAD
    
    let movieboxSources = [];
    let movieboxInfo = null;
    
    if (includeSources === "true") {
      console.log(`Looking for MovieBox sources for TMDB ID: ${tmdbId}`);
      
    
      movieboxInfo = await findMovieBoxId(tmdbData);
      
      if (movieboxInfo) {
        console.log(`Found MovieBox match: ${movieboxInfo.title} (ID: ${movieboxInfo.id})`);
        
        
        movieboxSources = await getMovieBoxSources(movieboxInfo.id);
        console.log(`Found ${movieboxSources.length} sources`);
      } else {
        console.log('No MovieBox match found');
      }
    }

 
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


export const getMovieSources = async (req, res) => {
  try {
    const { tmdbId } = req.params;
    const { season, episode } = req.query;
    

    const tmdbData = await getMovieDetails(tmdbId);
    
    if (!tmdbData) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    
    const movieboxInfo = await findMovieBoxId(tmdbData);
    
    if (!movieboxInfo) {
      return res.status(404).json({ message: 'No streaming sources found for this movie' });
    }
    
   
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
=======
    res.json({ ...tmdbData, omdb: omdbData, ai_summary: aiSummaryText });
  } catch (error) {
>>>>>>> 9f79863cc8a29cab049d0bdaa7f586b2f5c9eb5f
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