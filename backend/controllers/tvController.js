import { 
  searchTVShows, 
  getTVShowDetails, 
  getTrendingTVShows,
  getPopularTVShows,
  getTopRatedTVShows,
  getAiringTodayTVShows,
  getOnTheAirTVShows
} from "../utils/tmdbApi.js";
import { getMovieSummary } from "../utils/cohereApi.js";
import { findMovieBoxId, getMovieBoxSources } from "../utils/movieboxApi.js";

// Cache for TV details
const tvCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const searchTV = async (req, res) => {
  try {
    const { query } = req.query;
    const results = await searchTVShows(query);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const tvDetails = async (req, res) => {
  try {
    const { tvId } = req.params;
    const { aiSummary, includeSources } = req.query;

    // Check cache first
    const cacheKey = `${tvId}_${aiSummary}_${includeSources}`;
    const cached = tvCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log(`Serving TV from cache: ${tvId}`);
      return res.json(cached.data);
    }

    // Get TMDB data (fastest call)
    const tmdbData = await getTVShowDetails(tvId);
    
    // Prepare response with TMDB data immediately
    const response = { ...tmdbData };

    // Start background tasks
    const promises = [];

    // AI Summary (if requested)
    if (aiSummary === "true") {
      const plot = tmdbData.overview || tmdbData.name;
      promises.push(
        getMovieSummary(plot).then(summary => {
          response.ai_summary = summary;
        }).catch(err => {
          console.log('AI summary failed:', err.message);
          response.ai_summary = "";
        })
      );
    }

    // MovieBox info (only basic info, not sources)
    if (includeSources === "true") {
      promises.push(
        (async () => {
          try {
            console.log(`Looking for MovieBox sources for TMDB TV ID: ${tvId}`);
            
            // Timeout for this operation
            const timeoutPromise = new Promise((_, reject) => 
              setTimeout(() => reject(new Error('MovieBox timeout')), 5000)
            );
            
            const movieboxInfo = await Promise.race([
              findMovieBoxId(tmdbData),
              timeoutPromise
            ]);
            
            if (movieboxInfo) {
              console.log(`Found MovieBox match: ${movieboxInfo.title} (ID: ${movieboxInfo.id})`);
              response.moviebox = {
                id: movieboxInfo.id,
                title: movieboxInfo.title,
                type: 'tv',
                hasSources: true
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

    // Cache in background
    Promise.allSettled(promises).then(() => {
      tvCache.set(cacheKey, {
        data: response,
        timestamp: Date.now()
      });
    });

    // Return immediately with TMDB data
    res.json(response);
    
  } catch (error) {
    console.error('TV details error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get TV episode sources - optimized with timeout
export const getTVEpisodeSources = async (req, res) => {
  try {
    const { tvId } = req.params;
    const { season, episode } = req.query;
    
    if (!season || !episode) {
      return res.status(400).json({ message: 'Season and episode are required' });
    }
    
    // Set timeout for the entire request
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), 8000)
    );
    
    const result = await Promise.race([
      (async () => {
        // Get TMDB data
        const tmdbData = await getTVShowDetails(tvId);
        
        if (!tmdbData) {
          return { sources: [] };
        }
        
        // Find MovieBox ID
        const movieboxInfo = await findMovieBoxId(tmdbData);
        
        if (!movieboxInfo) {
          return { sources: [] };
        }
        
        // Get sources for episode
        const sources = await getMovieBoxSources(
          movieboxInfo.id,
          parseInt(season),
          parseInt(episode)
        );
        
        return {
          tmdbId: tvId,
          movieboxId: movieboxInfo.id,
          title: tmdbData.name,
          season,
          episode,
          sources: sources
        };
      })(),
      timeoutPromise
    ]);
    
    res.json(result);
    
  } catch (error) {
    console.error('Get TV episode sources error:', error);
    // Return empty sources on error
    res.json({ sources: [] });
  }
};

export const trendingTV = async (req, res) => {
  try {
    const tvShows = await getTrendingTVShows();
    res.json(tvShows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const popularTV = async (req, res) => {
  try {
    const tvShows = await getPopularTVShows();
    res.json(tvShows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const topRatedTV = async (req, res) => {
  try {
    const tvShows = await getTopRatedTVShows();
    res.json(tvShows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const airingTodayTV = async (req, res) => {
  try {
    const tvShows = await getAiringTodayTVShows();
    res.json(tvShows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const onTheAirTV = async (req, res) => {
  try {
    const tvShows = await getOnTheAirTVShows();
    res.json(tvShows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};