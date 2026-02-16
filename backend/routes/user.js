import express from "express";
const router = express.Router();
import { addToWatchlist, getWatchlist, addToHistory } from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";

router.get("/watchlist", authMiddleware, getWatchlist);

router.post("/watchlist", authMiddleware, addToWatchlist);

router.post("/history", authMiddleware, addToHistory);

export default router;
  