import express from "express";
const router = express.Router();
import authMiddleware from "../middleware/authMiddleware.js";
import {
  rateItem,
  getUserRatings,
  getItemRating,
  updateRating,
  deleteRating,
  getAverageRating
} from "../controllers/ratingController.js";

router.use(authMiddleware);

router.post("/rate", rateItem);

router.get("/my-ratings", getUserRatings);

router.get("/item/:tmdbId", getItemRating);

router.put("/:tmdbId", updateRating);

router.delete("/:tmdbId", deleteRating);

router.get("/average/:tmdbId", getAverageRating);

export default router;