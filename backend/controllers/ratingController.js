import Watchlist from "../models/Watchlist.js";

export const rateItem = async (req, res) => {
  try {
    const { tmdbId, rating, review, media_type } = req.body;
    const userId = req.user._id;

    if (rating < 0 || rating > 10) {
      return res.status(400).json({ 
        message: "Rating must be between 0 and 10" 
      });
    }

    let watchlistItem = await Watchlist.findOne({
      user: userId,
      tmdbId: tmdbId
    });

    if (!watchlistItem) {
      watchlistItem = await Watchlist.create({
        user: userId,
        tmdbId,
        media_type: media_type || 'movie',
        title: req.body.title,
        poster: req.body.poster,
        userRating: rating,
        ratedAt: new Date(),
        review: review || null
      });
    } else {
   
      watchlistItem.userRating = rating;
      watchlistItem.ratedAt = new Date();
      if (review) watchlistItem.review = review;
      await watchlistItem.save();
    }

    res.json({
      success: true,
      message: "Rating saved successfully",
      item: watchlistItem
    });
  } catch (error) {
    console.error('Error rating item:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getUserRatings = async (req, res) => {
  try {
    const ratings = await Watchlist.find({
      user: req.user._id,
      userRating: { $ne: null }
    }).sort({ ratedAt: -1 });

    res.json(ratings);
  } catch (error) {
    console.error('Error fetching ratings:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getItemRating = async (req, res) => {
  try {
    const { tmdbId } = req.params;
    
    const item = await Watchlist.findOne({
      user: req.user._id,
      tmdbId: tmdbId
    });

    res.json({
      userRating: item?.userRating || null,
      review: item?.review || null,
      ratedAt: item?.ratedAt || null
    });
  } catch (error) {
    console.error('Error fetching item rating:', error);
    res.status(500).json({ message: error.message });
  }
};

export const updateRating = async (req, res) => {
  try {
    const { tmdbId } = req.params;
    const { rating, review } = req.body;

    const watchlistItem = await Watchlist.findOne({
      user: req.user._id,
      tmdbId: tmdbId
    });

    if (!watchlistItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    watchlistItem.userRating = rating;
    if (review !== undefined) watchlistItem.review = review;
    watchlistItem.ratedAt = new Date();
    
    await watchlistItem.save();

    res.json({
      success: true,
      message: "Rating updated successfully",
      item: watchlistItem
    });
  } catch (error) {
    console.error('Error updating rating:', error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteRating = async (req, res) => {
  try {
    const { tmdbId } = req.params;

    const watchlistItem = await Watchlist.findOne({
      user: req.user._id,
      tmdbId: tmdbId
    });

    if (!watchlistItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    watchlistItem.userRating = null;
    watchlistItem.review = null;
    watchlistItem.ratedAt = null;
    
    await watchlistItem.save();

    res.json({
      success: true,
      message: "Rating removed successfully"
    });
  } catch (error) {
    console.error('Error deleting rating:', error);
    res.status(500).json({ message: error.message });
  }
};


export const getAverageRating = async (req, res) => {
  try {
    const { tmdbId } = req.params;

    const result = await Watchlist.aggregate([
      { $match: { tmdbId: tmdbId, userRating: { $ne: null } } },
      { 
        $group: {
          _id: null,
          averageRating: { $avg: "$userRating" },
          totalRatings: { $sum: 1 }
        }
      }
    ]);

    if (result.length > 0) {
      res.json({
        averageRating: result[0].averageRating.toFixed(1),
        totalRatings: result[0].totalRatings
      });
    } else {
      res.json({
        averageRating: null,
        totalRatings: 0
      });
    }
  } catch (error) {
    console.error('Error calculating average rating:', error);
    res.status(500).json({ message: error.message });
  }
};