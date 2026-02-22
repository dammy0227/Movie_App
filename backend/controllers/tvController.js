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

    // Get TMDB data
    const tmdbData = await getTVShowDetails(tvId);

    // Get AI summary if requested
    let aiSummaryText = "";
    if (aiSummary === "true") {
      const plot = tmdbData.overview || tmdbData.name;
      aiSummaryText = await getMovieSummary(plot);
    }

    // Get MovieBox streaming sources if requested
    let movieboxSources = [];
    let movieboxInfo = null;
    
    if (includeSources === "true") {
      console.log(`Looking for MovieBox sources for TMDB TV ID: ${tvId}`);
      
      // Find matching MovieBox ID
      movieboxInfo = await findMovieBoxId(tmdbData);
      
      if (movieboxInfo) {
        console.log(`Found MovieBox match: ${movieboxInfo.title} (ID: ${movieboxInfo.id})`);
        
        // For TV shows, we don't fetch sources here (need season/episode)
        // Just return the MovieBox ID info
        movieboxInfo.hasSources = true;
      } else {
        console.log('No MovieBox match found');
      }
    }

    res.json({ 
      ...tmdbData, 
      ai_summary: aiSummaryText,
      moviebox: movieboxInfo ? {
        id: movieboxInfo.id,
        title: movieboxInfo.title,
        type: 'tv'
      } : null
    });
    
  } catch (error) {
    console.error('TV details error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get TV episode sources
export const getTVEpisodeSources = async (req, res) => {
  try {
    const { tvId } = req.params;
    const { season, episode } = req.query;
    
    if (!season || !episode) {
      return res.status(400).json({ message: 'Season and episode are required' });
    }
    
    // Get TMDB data first
    const tmdbData = await getTVShowDetails(tvId);
    
    if (!tmdbData) {
      return res.status(404).json({ message: 'TV show not found' });
    }
    
    // Find MovieBox ID
    const movieboxInfo = await findMovieBoxId(tmdbData);
    
    if (!movieboxInfo) {
      return res.status(404).json({ message: 'No streaming sources found for this show' });
    }
    
    // Get sources for specific episode
    const sources = await getMovieBoxSources(
      movieboxInfo.id,
      parseInt(season),
      parseInt(episode)
    );
    
    res.json({
      tmdbId: tvId,
      movieboxId: movieboxInfo.id,
      title: tmdbData.name,
      season,
      episode,
      sources: sources
    });
    
  } catch (error) {
    console.error('Get TV episode sources error:', error);
    res.status(500).json({ message: error.message });
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