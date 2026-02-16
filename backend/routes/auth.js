import express from "express";
const router = express.Router();
import { register, login } from "../controllers/authController.js";

// Register user
router.post("/register", register);

// Login user
router.post("/login", login);

export default router;
