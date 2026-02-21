import express from "express";
const router = express.Router();
import { 
  searchTV, 
  tvDetails, 
  trendingTV,
  popularTV,
  topRatedTV,
  airingTodayTV,
<<<<<<< HEAD
  onTheAirTV,
  getTVEpisodeSources  
=======
  onTheAirTV
>>>>>>> 9f79863cc8a29cab049d0bdaa7f586b2f5c9eb5f
} from "../controllers/tvController.js";

router.get("/search", searchTV);
router.get("/trending", trendingTV);
router.get("/popular", popularTV);
router.get("/top-rated", topRatedTV);
router.get("/airing-today", airingTodayTV);
router.get("/on-the-air", onTheAirTV);
router.get("/details/:tvId", tvDetails);
<<<<<<< HEAD
router.get("/sources/:tvId", getTVEpisodeSources);
=======
>>>>>>> 9f79863cc8a29cab049d0bdaa7f586b2f5c9eb5f

export default router;