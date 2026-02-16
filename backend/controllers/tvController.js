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
    const { aiSummary } = req.query;

    const tmdbData = await getTVShowDetails(tvId);

    let aiSummaryText = "";
    if (aiSummary === "true") {
      const plot = tmdbData.overview || tmdbData.name;
      aiSummaryText = await getMovieSummary(plot);
    }

    res.json({ ...tmdbData, ai_summary: aiSummaryText });
  } catch (error) {
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