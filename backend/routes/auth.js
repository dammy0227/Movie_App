import express from "express";
const router = express.Router();
import { register, login } from "../controllers/authController.js";
import { googleAuth } from "../controllers/googleAuthController.js"; 

// Register user
router.post("/register", register);

// Login user
router.post("/login", login);


router.post("/google", googleAuth);

export default router;