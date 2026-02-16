import express from "express";
const router = express.Router();
import { searchAll } from "../controllers/searchController.js";

router.get("/all", searchAll);

export default router;