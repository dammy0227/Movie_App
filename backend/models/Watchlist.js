import mongoose from "mongoose";

const watchlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tmdbId: {
      type: String, 
      required: true,
    },
    omdbId: {
      type: String, 
    },
    title: {
      type: String,
      required: true,
    },
    poster: {
      type: String, 
    },
    media_type: {  
      type: String,
      enum: ['movie', 'tv'],
      default: 'movie',
      required: true
    },
    voteAverage: {  
      type: Number,
    },
    release_date: {  
      type: String,
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Watchlist", watchlistSchema);