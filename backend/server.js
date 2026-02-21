import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import movieRoutes from "./routes/movies.js";
import tvRoutes from "./routes/tv.js";
import peopleRoutes from "./routes/people.js";
import collectionRoutes from "./routes/collection.js";
import searchRoutes from "./routes/search.js";
import aiRoutes from "./routes/ai.js";
import userRoutes from "./routes/user.js";
<<<<<<< HEAD
import ratingRoutes from "./routes/ratingRoutes.js";
import movieboxRoutes from "./routes/movieboxRoutes.js"; 
=======
import ratingRoutes from "./routes/ratingRoutes.js"; 
>>>>>>> 9f79863cc8a29cab049d0bdaa7f586b2f5c9eb5f

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: [
    "https://movie-app-eight-rho-22.vercel.app",
    "http://localhost:5173"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true,
}));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/tv", tvRoutes);              
app.use("/api/people", peopleRoutes);       
app.use("/api/collections", collectionRoutes); 
app.use("/api/search", searchRoutes);      
app.use("/api/ai", aiRoutes);
app.use("/api/user", userRoutes);
<<<<<<< HEAD
app.use("/api/ratings", ratingRoutes);
app.use("/api/moviebox", movieboxRoutes); 
=======
app.use("/api/ratings", ratingRoutes); 
>>>>>>> 9f79863cc8a29cab049d0bdaa7f586b2f5c9eb5f

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));