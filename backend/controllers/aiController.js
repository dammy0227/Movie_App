import { getMovieRecommendationCriteria, getMovieSummary } from "../utils/cohereApi.js";
import { discoverMoviesByCriteria, getPopularMovies } from "../utils/tmdbApi.js";

export const aiRecommend = async (req, res) => {
  try {
    const { prompt } = req.body;
    
    console.log('=== AI Recommendation Request ===');
    console.log('Prompt:', prompt);
    
    if (!prompt) {
      return res.status(400).json({ message: "Prompt is required" });
    }


    const criteria = await getMovieRecommendationCriteria(prompt);
    console.log('Generated criteria:', criteria);
 
    let movies = await discoverMoviesByCriteria(criteria);
    console.log(`Found ${movies.length} movies`);
  
    if (!movies || movies.length === 0) {
      console.log('No movies found with criteria, fetching popular movies');
      movies = await getPopularMovies();
    }


    if (!movies || movies.length === 0) {
      return res.json({ 
        criteria, 
        movies: [],
        message: "No movies found"
      });
    }

   
    const topMovies = await Promise.all(
      movies.slice(0, 20).map(async (movie) => {
        try {
          const summary = await getMovieSummary(movie.overview || movie.title);
          return { 
            ...movie, 
            ai_summary: summary,
            poster_path: movie.poster_path || null,
            vote_average: movie.vote_average || 0,
            release_date: movie.release_date || null
          };
        } catch (error) {
          console.error(`Error getting summary for movie ${movie.id}:`, error);
          return { 
            ...movie, 
            ai_summary: "Summary not available",
            poster_path: movie.poster_path || null,
            vote_average: movie.vote_average || 0,
            release_date: movie.release_date || null
          };
        }
      })
    );

    res.json({ criteria, movies: topMovies });
  } catch (error) {
    console.error('AI Recommendation Error:', error);
    
    try {
      const fallbackMovies = await getPopularMovies();
      const topFallback = fallbackMovies.slice(0, 10).map(movie => ({
        ...movie,
        ai_summary: "Popular movie recommendation"
      }));
      
      res.json({ 
        criteria: { genre: "Popular", keywords: "", max_runtime: 120 },
        movies: topFallback 
      });
    } catch (fallbackError) {
      res.status(500).json({ 
        message: "Failed to get recommendations",
        error: error.message 
      });
    }
  }
};

export const aiSummary = async (req, res) => {
  try {
    const { plot } = req.body;
    
    if (!plot) {
      return res.status(400).json({ message: "Plot is required" });
    }

    const summary = await getMovieSummary(plot);
    res.json({ summary });
  } catch (error) {
    console.error('AI Summary Error:', error);
    res.status(500).json({ message: error.message });
  }
}; 