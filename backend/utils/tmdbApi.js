import axios from 'axios';
import dotenv from "dotenv";
dotenv.config();

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

// ============= TV SHOWS =============
export const searchTVShows = async (query) => {
  try {
    const response = await axios.get(`${BASE_URL}/search/tv`, {
      params: {
        api_key: TMDB_API_KEY,
        query,
        page: 1
      }
    });
    return response.data.results;
  } catch (error) {
    console.error('Error searching TV shows:', error);
    return [];
  }
};

export const getTVShowDetails = async (tvId) => {
  try {
    const response = await axios.get(`${BASE_URL}/tv/${tvId}`, {
      params: {
        api_key: TMDB_API_KEY,
        append_to_response: 'credits,videos,external_ids'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting TV show details:', error);
    return null;
  }
};

export const getTrendingTVShows = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/trending/tv/week`, {
      params: {
        api_key: TMDB_API_KEY
      }
    });
    return response.data.results;
  } catch (error) {
    console.error('Error getting trending TV shows:', error);
    return [];
  }
};

export const getPopularTVShows = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/tv/popular`, {
      params: {
        api_key: TMDB_API_KEY
      }
    });
    return response.data.results;
  } catch (error) {
    console.error('Error getting popular TV shows:', error);
    return [];
  }
};

export const getTopRatedTVShows = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/tv/top_rated`, {
      params: {
        api_key: TMDB_API_KEY
      }
    });
    return response.data.results;
  } catch (error) {
    console.error('Error getting top rated TV shows:', error);
    return [];
  }
};

export const getAiringTodayTVShows = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/tv/airing_today`, {
      params: {
        api_key: TMDB_API_KEY
      }
    });
    return response.data.results;
  } catch (error) {
    console.error('Error getting airing today TV shows:', error);
    return [];
  }
};

export const getOnTheAirTVShows = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/tv/on_the_air`, {
      params: {
        api_key: TMDB_API_KEY
      }
    });
    return response.data.results;
  } catch (error) {
    console.error('Error getting on the air TV shows:', error);
    return [];
  }
};

// ============= PEOPLE =============
export const searchPeople = async (query) => {
  try {
    const response = await axios.get(`${BASE_URL}/search/person`, {
      params: {
        api_key: TMDB_API_KEY,
        query,
        page: 1
      }
    });
    return response.data.results;
  } catch (error) {
    console.error('Error searching people:', error);
    return [];
  }
};

export const getPersonDetails = async (personId) => {
  try {
    const response = await axios.get(`${BASE_URL}/person/${personId}`, {
      params: {
        api_key: TMDB_API_KEY,
        append_to_response: 'movie_credits,tv_credits,external_ids'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting person details:', error);
    return null;
  }
};

export const getPopularPeople = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/person/popular`, {
      params: {
        api_key: TMDB_API_KEY
      }
    });
    return response.data.results;
  } catch (error) {
    console.error('Error getting popular people:', error);
    return [];
  }
};

// ============= COLLECTIONS =============
export const getCollectionDetails = async (collectionId) => {
  try {
    const response = await axios.get(`${BASE_URL}/collection/${collectionId}`, {
      params: {
        api_key: TMDB_API_KEY
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting collection details:', error);
    return null;
  }
};

// ============= MULTI-SEARCH =============
export const multiSearch = async (query) => {
  try {
    const response = await axios.get(`${BASE_URL}/search/multi`, {
      params: {
        api_key: TMDB_API_KEY,
        query,
        page: 1
      }
    });
    return response.data.results;
  } catch (error) {
    console.error('Error in multi-search:', error);
    return [];
  }
};

// ============= EXISTING MOVIE FUNCTIONS =============
// (Keep all your existing movie functions here)
export const searchMovies = async (query) => {
  try {
    const response = await axios.get(`${BASE_URL}/search/movie`, {
      params: {
        api_key: TMDB_API_KEY,
        query,
        page: 1
      }
    });
    return response.data.results;
  } catch (error) {
    console.error('Error searching movies:', error);
    return [];
  }
};

export const getMovieDetails = async (movieId) => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/${movieId}`, {
      params: {
        api_key: TMDB_API_KEY,
        append_to_response: 'credits,videos,external_ids'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting movie details:', error);
    return null;
  }
};

export const getTrendingMovies = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/trending/movie/week`, {
      params: {
        api_key: TMDB_API_KEY
      }
    });
    return response.data.results;
  } catch (error) {
    console.error('Error getting trending movies:', error);
    return [];
  }
};

export const getPopularMovies = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/popular`, {
      params: {
        api_key: TMDB_API_KEY
      }
    });
    return response.data.results;
  } catch (error) {
    console.error('Error getting popular movies:', error);
    return [];
  }
};

export const getTopRatedMovies = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/top_rated`, {
      params: {
        api_key: TMDB_API_KEY
      }
    });
    return response.data.results;
  } catch (error) {
    console.error('Error getting top rated movies:', error);
    return [];
  }
};

export const getNowPlayingMovies = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/now_playing`, {
      params: {
        api_key: TMDB_API_KEY
      }
    });
    return response.data.results;
  } catch (error) {
    console.error('Error getting now playing movies:', error);
    return [];
  }
};

export const getUpcomingMovies = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/upcoming`, {
      params: {
        api_key: TMDB_API_KEY
      }
    });
    return response.data.results;
  } catch (error) {
    console.error('Error getting upcoming movies:', error);
    return [];
  }
};

// ============= DISCOVER FUNCTIONS (keep existing) =============
export const discoverMoviesByCriteria = async (criteria) => {
  // Keep your existing discoverMoviesByCriteria function here
  try {
    console.log('Discovering movies with criteria:', criteria);
    
    let movies = [];
    
    if (criteria.genre && criteria.genre !== "Popular") {
      console.log('Approach 1: Trying with genre only');
      movies = await discoverByGenre(criteria.genre);
      if (movies.length > 0) {
        console.log(`Found ${movies.length} movies with genre: ${criteria.genre}`);
        return movies;
      }
    }
    
    if (criteria.keywords && criteria.keywords.trim()) {
      console.log('Approach 2: Trying with keywords');
      movies = await discoverByKeywords(criteria.keywords);
      if (movies.length > 0) {
        console.log(`Found ${movies.length} movies with keywords`);
        return movies;
      }
    }
    
    console.log('Approach 3: Falling back to popular movies');
    movies = await getPopularMovies();
    
    if (criteria.max_runtime && movies.length > 0) {
      movies = movies.filter(movie => 
        !movie.runtime || movie.runtime <= criteria.max_runtime
      );
    }
    
    console.log(`Returning ${movies.length} popular movies`);
    return movies;
    
  } catch (error) {
    console.error('Error in discoverMoviesByCriteria:', error);
    return await getPopularMovies();
  }
};

async function discoverByGenre(genreName) {
  // Keep your existing discoverByGenre function
  try {
    const genreMap = {
      'Action': 28,
      'Adventure': 12,
      'Animation': 16,
      'Comedy': 35,
      'Crime': 80,
      'Documentary': 99,
      'Drama': 18,
      'Family': 10751,
      'Fantasy': 14,
      'History': 36,
      'Horror': 27,
      'Music': 10402,
      'Mystery': 9648,
      'Romance': 10749,
      'Science Fiction': 878,
      'Sci-Fi': 878,
      'TV Movie': 10770,
      'Thriller': 53,
      'War': 10752,
      'Western': 37
    };
    
    const genreId = genreMap[genreName] || 
                    genreMap[Object.keys(genreMap).find(key => 
                      key.toLowerCase() === genreName.toLowerCase()
                    )];
    
    if (!genreId) {
      console.log(`No genre ID found for: ${genreName}`);
      return [];
    }
    
    const response = await axios.get(`${BASE_URL}/discover/movie`, {
      params: {
        api_key: TMDB_API_KEY,
        with_genres: genreId,
        sort_by: 'popularity.desc',
        page: 1
      }
    });
    
    return response.data.results || [];
  } catch (error) {
    console.error('Error in discoverByGenre:', error);
    return [];
  }
}

async function discoverByKeywords(keywords) {
  // Keep your existing discoverByKeywords function
  try {
    const keywordList = keywords.split(',').map(k => k.trim());
    const searchPromises = keywordList.map(keyword => 
      axios.get(`${BASE_URL}/search/movie`, {
        params: {
          api_key: TMDB_API_KEY,
          query: keyword,
          page: 1
        }
      })
    );
    
    const responses = await Promise.all(searchPromises);
    const movieMap = new Map();
    
    responses.forEach(response => {
      response.data.results.forEach(movie => {
        if (!movieMap.has(movie.id)) {
          movieMap.set(movie.id, movie);
        }
      });
    });
    
    return Array.from(movieMap.values()).slice(0, 20);
  } catch (error) {
    console.error('Error in discoverByKeywords:', error);
    return [];
  }
}