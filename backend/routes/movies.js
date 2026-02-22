// routes/movieRoutes.js
import express from "express";
const router = express.Router();
import { 
  searchMovie, 
  movieDetails,
  movieOmdbRatings,
  movieAISummary,
  trendingMovies,
  popularMovies,
  topRatedMovies,
  nowPlayingMovies,
  upcomingMovies,
  getMovieSources  
} from "../controllers/movieController.js";

// Main endpoints
router.get("/search", searchMovie);
router.get("/trending", trendingMovies);
router.get("/popular", popularMovies);
router.get("/top-rated", topRatedMovies);
router.get("/now-playing", nowPlayingMovies);
router.get("/upcoming", upcomingMovies);

// FAST endpoint - only TMDB details
router.get("/details/:tmdbId", movieDetails);

// Separate endpoints for additional data
router.get("/omdb/:imdbId", movieOmdbRatings);
router.post("/ai-summary", movieAISummary);
router.get("/sources/:tmdbId", getMovieSources);

export default router;