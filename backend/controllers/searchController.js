import { multiSearch } from "../utils/tmdbApi.js";

export const searchAll = async (req, res) => {
  try {
    const { query } = req.query;
    const results = await multiSearch(query);
    
    const categorized = {
      movies: results.filter(item => item.media_type === 'movie'),
      tv: results.filter(item => item.media_type === 'tv'),
      people: results.filter(item => item.media_type === 'person')
    };
    
    res.json(categorized);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};