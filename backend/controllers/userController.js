import Watchlist from "../models/Watchlist.js";
import History from "../models/History.js";

export const addToWatchlist = async (req, res) => {
  try {
    const { tmdbId, omdbId, title, poster, voteAverage, release_date, media_type } = req.body;
    
    console.log('Adding to watchlist:', { tmdbId, title, media_type }); 
    
    const existing = await Watchlist.findOne({
      user: req.user._id,
      tmdbId: tmdbId
    });
    
    if (existing) {
      return res.status(400).json({ message: "Already in watchlist" });
    }
    
    const watchlistItem = await Watchlist.create({
      user: req.user._id,
      tmdbId,
      omdbId,
      title,
      poster,
      voteAverage,
      release_date,
      media_type: media_type || 'movie' 
    });
    
    console.log('Watchlist item created:', watchlistItem);
    res.status(201).json(watchlistItem);
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getWatchlist = async (req, res) => {
  try {
    const list = await Watchlist.find({ user: req.user._id });
    console.log('Watchlist retrieved:', list.length, 'items');
    res.json(list);
  } catch (error) {
    console.error('Error getting watchlist:', error);
    res.status(500).json({ message: error.message });
  }
};

export const addToHistory = async (req, res) => {
  try {
    const { tmdbId, omdbId, title } = req.body;
    const historyItem = await History.create({
      user: req.user._id,
      tmdbId,
      omdbId,
      title,
    });
    res.status(201).json(historyItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};