import express from "express";
const router = express.Router();
import { 
  searchTV, 
  tvDetails, 
  trendingTV,
  popularTV,
  topRatedTV,
  airingTodayTV,
  onTheAirTV,
  getTVEpisodeSources  
} from "../controllers/tvController.js";

router.get("/search", searchTV);
router.get("/trending", trendingTV);
router.get("/popular", popularTV);
router.get("/top-rated", topRatedTV);
router.get("/airing-today", airingTodayTV);
router.get("/on-the-air", onTheAirTV);
router.get("/details/:tvId", tvDetails);
router.get("/sources/:tvId", getTVEpisodeSources);

export default router;