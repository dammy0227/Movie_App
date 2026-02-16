import express from "express";
const router = express.Router();
import { collectionDetails } from "../controllers/collectionController.js";

router.get("/details/:collectionId", collectionDetails);

export default router;