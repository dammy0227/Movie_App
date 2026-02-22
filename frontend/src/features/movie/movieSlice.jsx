// features/movie/movieSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { 
  getTrendingMovies, 
  getPopularMovies,
  getTopRatedMovies,
  getNowPlayingMovies,
  getUpcomingMovies,
  searchMovies, 
  getMovieDetails,
  getMovieOmdbRatings,
  getMovieAISummary,
  getMovieSources
} from "../../services/movieService";

export const fetchTrending = createAsyncThunk("movie/fetchTrending", async (_, { rejectWithValue }) => {
  try {
    return await getTrendingMovies();
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const fetchPopular = createAsyncThunk("movie/fetchPopular", async (_, { rejectWithValue }) => {
  try {
    return await getPopularMovies();
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const fetchTopRated = createAsyncThunk("movie/fetchTopRated", async (_, { rejectWithValue }) => {
  try {
    return await getTopRatedMovies();
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const fetchNowPlaying = createAsyncThunk("movie/fetchNowPlaying", async (_, { rejectWithValue }) => {
  try {
    return await getNowPlayingMovies();
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const fetchUpcoming = createAsyncThunk("movie/fetchUpcoming", async (_, { rejectWithValue }) => {
  try {
    return await getUpcomingMovies();
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const fetchSearch = createAsyncThunk("movie/fetchSearch", async (query, { rejectWithValue }) => {
  try {
    return await searchMovies(query);
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// FAST - only movie details
export const fetchMovieDetails = createAsyncThunk(
  "movie/fetchMovieDetails", 
  async (tmdbId, { rejectWithValue }) => {
    try {
      return await getMovieDetails(tmdbId);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// fetch OMDB ratings separately
export const fetchOmdbRatings = createAsyncThunk(
  "movie/fetchOmdbRatings",
  async (imdbId) => {
    try {
      return await getMovieOmdbRatings(imdbId);
    } catch (error) {
      console.log(error)
      return {};
    }
  }
);

// fetch AI summary separately
export const fetchAISummary = createAsyncThunk(
  "movie/fetchAISummary",
  async (plot) => {
    try {
      return await getMovieAISummary(plot);
    } catch (error) {
      console.log(error)
      return { summary: 'Summary unavailable' };
    }
  }
);

// Movie Sources only
export const fetchMovieSources = createAsyncThunk(
  "movie/fetchMovieSources", 
  async (tmdbId) => {
    try {
      return await getMovieSources(tmdbId);
    } catch (error) {
      console.log(error)
      return { sources: [] };
    }
  }
);

const initialState = {
  trending: [],
  popular: [],
  topRated: [],
  nowPlaying: [],
  upcoming: [],
  searchResults: [],
  details: null,
  omdbRatings: null,
  sources: null,
  loading: false,
  error: null,
};

const movieSlice = createSlice({
  name: "movie",
  initialState,
  reducers: {
    clearSearch: (state) => {
      state.searchResults = [];
    },
    clearError: (state) => {
      state.error = null;
    },
    clearDetails: (state) => {
      state.details = null;
      state.omdbRatings = null;
      state.sources = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Trending
      .addCase(fetchTrending.pending, (state) => { 
        state.loading = true; 
        state.error = null; 
      })
      .addCase(fetchTrending.fulfilled, (state, action) => { 
        state.loading = false; 
        state.trending = action.payload || []; 
      })
      .addCase(fetchTrending.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload; 
      })

      // Popular
      .addCase(fetchPopular.pending, (state) => { 
        state.loading = true; 
        state.error = null; 
      })
      .addCase(fetchPopular.fulfilled, (state, action) => { 
        state.loading = false; 
        state.popular = action.payload || []; 
      })
      .addCase(fetchPopular.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload; 
      })

      // Top Rated
      .addCase(fetchTopRated.pending, (state) => { 
        state.loading = true; 
        state.error = null; 
      })
      .addCase(fetchTopRated.fulfilled, (state, action) => { 
        state.loading = false; 
        state.topRated = action.payload || []; 
      })
      .addCase(fetchTopRated.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload; 
      })

      // Now Playing
      .addCase(fetchNowPlaying.pending, (state) => { 
        state.loading = true; 
        state.error = null; 
      })
      .addCase(fetchNowPlaying.fulfilled, (state, action) => { 
        state.loading = false; 
        state.nowPlaying = action.payload || []; 
      })
      .addCase(fetchNowPlaying.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload; 
      })

      // Upcoming
      .addCase(fetchUpcoming.pending, (state) => { 
        state.loading = true; 
        state.error = null; 
      })
      .addCase(fetchUpcoming.fulfilled, (state, action) => { 
        state.loading = false; 
        state.upcoming = action.payload || []; 
      })
      .addCase(fetchUpcoming.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload; 
      })

      // Search
      .addCase(fetchSearch.pending, (state) => { 
        state.loading = true; 
        state.error = null; 
      })
      .addCase(fetchSearch.fulfilled, (state, action) => { 
        state.loading = false; 
        state.searchResults = action.payload || []; 
      })
      .addCase(fetchSearch.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload; 
      })

      // Movie Details - FAST (only TMDB data)
      .addCase(fetchMovieDetails.pending, (state) => { 
        state.loading = true; 
        state.error = null; 
      })
      .addCase(fetchMovieDetails.fulfilled, (state, action) => { 
        state.loading = false; 
        state.details = action.payload || null;
      })
      .addCase(fetchMovieDetails.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload; 
      })

      // OMDB Ratings (background)
      .addCase(fetchOmdbRatings.fulfilled, (state, action) => {
        state.omdbRatings = action.payload;
      })

      // Movie Sources only
      .addCase(fetchMovieSources.pending, (state) => { 
        state.loading = true; 
        state.error = null; 
      })
      .addCase(fetchMovieSources.fulfilled, (state, action) => { 
        state.loading = false; 
        state.sources = action.payload || null; 
      })
      .addCase(fetchMovieSources.rejected, (state) => { 
        state.loading = false; 
        state.sources = { sources: [] };
      });
  },
});

export const { clearSearch, clearError, clearDetails } = movieSlice.actions;
export default movieSlice.reducer;