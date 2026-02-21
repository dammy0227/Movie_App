import express from "express";
const router = express.Router();
import { 
  searchMovie, 
  movieDetails, 
  trendingMovies,
  popularMovies,
  topRatedMovies,
  nowPlayingMovies,
<<<<<<< HEAD
  upcomingMovies,
  getMovieSources  
=======
  upcomingMovies 
>>>>>>> 9f79863cc8a29cab049d0bdaa7f586b2f5c9eb5f
} from "../controllers/movieController.js";

router.get("/search", searchMovie);
router.get("/trending", trendingMovies);
router.get("/popular", popularMovies);
router.get("/top-rated", topRatedMovies);
router.get("/now-playing", nowPlayingMovies);
router.get("/upcoming", upcomingMovies);
router.get("/details/:tmdbId", movieDetails);
<<<<<<< HEAD
router.get("/sources/:tmdbId", getMovieSources); 
=======
>>>>>>> 9f79863cc8a29cab049d0bdaa7f586b2f5c9eb5f

export default router;