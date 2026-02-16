import express from "express";
const router = express.Router();
import { 
  searchMovie, 
  movieDetails, 
  trendingMovies,
  popularMovies,
  topRatedMovies,
  nowPlayingMovies,
  upcomingMovies 
} from "../controllers/movieController.js";

router.get("/search", searchMovie);
router.get("/trending", trendingMovies);
router.get("/popular", popularMovies);
router.get("/top-rated", topRatedMovies);
router.get("/now-playing", nowPlayingMovies);
router.get("/upcoming", upcomingMovies);
router.get("/details/:tmdbId", movieDetails);

export default router;