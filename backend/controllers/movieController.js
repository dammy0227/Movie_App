import { searchMovies, getMovieDetails, getTrendingMovies, getPopularMovies, getTopRatedMovies, getNowPlayingMovies, getUpcomingMovies } from "../utils/tmdbApi.js";
import { getMovieRatings } from "../utils/omdbApi.js";
import { getMovieSummary } from "../utils/cohereApi.js";

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
    const { omdbId, aiSummary } = req.query;

    const tmdbData = await getMovieDetails(tmdbId);

    let omdbData = {};
    if (omdbId) {
      omdbData = await getMovieRatings(omdbId);
    }

    let aiSummaryText = "";
    if (aiSummary === "true") {
      const plot = tmdbData.overview || tmdbData.title;
      aiSummaryText = await getMovieSummary(plot);
    }

    res.json({ ...tmdbData, omdb: omdbData, ai_summary: aiSummaryText });
  } catch (error) {
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