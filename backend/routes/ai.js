import express from "express";
const router = express.Router();
import { aiRecommend, aiSummary } from "../controllers/aiController.js";
import authMiddleware from "../middleware/authMiddleware.js";

router.post("/recommend", authMiddleware, aiRecommend);

router.post("/summary", authMiddleware, aiSummary);

export default router;
