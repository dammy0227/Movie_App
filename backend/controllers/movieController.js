import { searchMovies, getMovieDetails, getTrendingMovies, getPopularMovies, getTopRatedMovies, getNowPlayingMovies, getUpcomingMovies } from "../utils/tmdbApi.js";
import { getMovieRatings } from "../utils/omdbApi.js";
import { getMovieSummary } from "../utils/cohereApi.js";
import { findMovieBoxId, getMovieBoxSources } from "../utils/movieboxApi.js";

// Cache for movie details to avoid repeated calls
const movieCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

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

    // Check cache first
    const cacheKey = `${tmdbId}_${aiSummary}_${includeSources}`;
    const cached = movieCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log(`Serving from cache: ${tmdbId}`);
      return res.json(cached.data);
    }

    // Get TMDB data (this is the fastest call)
    const tmdbData = await getMovieDetails(tmdbId);
    
    // Prepare response with just TMDB data immediately
    const response = { ...tmdbData };

    // Start all other requests in parallel (don't await)
    const promises = [];

    // OMDB ratings (if needed)
    if (omdbId || tmdbData.imdb_id) {
      const imdbId = omdbId || tmdbData.imdb_id;
      if (imdbId) {
        promises.push(
          getMovieRatings(imdbId).then(omdbData => {
            response.omdb = omdbData;
          }).catch(err => {
            console.log('OMDB fetch failed:', err.message);
            response.omdb = {};
          })
        );
      }
    }

    // AI Summary (if requested)
    if (aiSummary === "true") {
      const plot = tmdbData.overview || tmdbData.title;
      promises.push(
        getMovieSummary(plot).then(summary => {
          response.ai_summary = summary;
        }).catch(err => {
          console.log('AI summary failed:', err.message);
          response.ai_summary = "";
        })
      );
    }

    // MovieBox sources - only if requested and with timeout
    if (includeSources === "true") {
      promises.push(
        (async () => {
          try {
            console.log(`Looking for MovieBox sources for TMDB ID: ${tmdbId}`);
            
            // Set timeout for this operation (5 seconds max)
            const timeoutPromise = new Promise((_, reject) => 
              setTimeout(() => reject(new Error('MovieBox timeout')), 5000)
            );
            
            const movieboxInfo = await Promise.race([
              findMovieBoxId(tmdbData),
              timeoutPromise
            ]);
            
            if (movieboxInfo) {
              console.log(`Found MovieBox match: ${movieboxInfo.title} (ID: ${movieboxInfo.id})`);
              
              // Get sources with timeout
              const sourcesTimeout = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Sources timeout')), 5000)
              );
              
              const movieboxSources = await Promise.race([
                getMovieBoxSources(movieboxInfo.id),
                sourcesTimeout
              ]);
              
              console.log(`Found ${movieboxSources.length} sources`);
              
              response.moviebox = {
                id: movieboxInfo.id,
                title: movieboxInfo.title,
                type: movieboxInfo.type,
                sources: movieboxSources
              };
            } else {
              console.log('No MovieBox match found');
              response.moviebox = null;
            }
          } catch (error) {
            console.log('MovieBox fetch failed:', error.message);
            response.moviebox = null;
          }
        })()
      );
    }

    // Wait for all promises to complete (or timeout) in the background
    // Don't await - let them run in background while we return the response
    Promise.allSettled(promises).then(() => {
      // Cache the final result after all promises settle
      movieCache.set(cacheKey, {
        data: response,
        timestamp: Date.now()
      });
    });

    // Return immediately with whatever data we have (at least TMDB data)
    res.json(response);
    
  } catch (error) {
    console.error('Movie details error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Optimized endpoint for sources only (called when user clicks "Watch Now")
export const getMovieSources = async (req, res) => {
  try {
    const { tmdbId } = req.params;
    const { season, episode } = req.query;
    
    // Set a timeout for the entire request
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), 8000)
    );
    
    const result = await Promise.race([
      (async () => {
        // Get TMDB data first
        const tmdbData = await getMovieDetails(tmdbId);
        
        if (!tmdbData) {
          throw new Error('Movie not found');
        }
        
        // Find MovieBox ID
        const movieboxInfo = await findMovieBoxId(tmdbData);
        
        if (!movieboxInfo) {
          return { sources: [] };
        }
        
        // Get sources
        const sources = await getMovieBoxSources(
          movieboxInfo.id, 
          season ? parseInt(season) : 0,
          episode ? parseInt(episode) : 0
        );
        
        return {
          tmdbId,
          movieboxId: movieboxInfo.id,
          title: movieboxInfo.title,
          sources: sources
        };
      })(),
      timeoutPromise
    ]);
    
    res.json(result);
    
  } catch (error) {
    console.error('Get movie sources error:', error);
    // Return empty sources on error instead of failing
    res.json({ sources: [] });
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