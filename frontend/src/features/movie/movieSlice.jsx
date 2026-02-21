import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { 
  getTrendingMovies, 
  getPopularMovies,
  getTopRatedMovies,
  getNowPlayingMovies,
  getUpcomingMovies,
  searchMovies, 
<<<<<<< HEAD
  getMovieDetails,
  getMovieSources
} from "../../services/movieService";

=======
  getMovieDetails 
} from "../../services/movieService";

// Thunks
>>>>>>> 9f79863cc8a29cab049d0bdaa7f586b2f5c9eb5f
export const fetchTrending = createAsyncThunk("movie/fetchTrending", async (_, thunkAPI) => {
  try {
    return await getTrendingMovies();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

export const fetchPopular = createAsyncThunk("movie/fetchPopular", async (_, thunkAPI) => {
  try {
    return await getPopularMovies();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

export const fetchTopRated = createAsyncThunk("movie/fetchTopRated", async (_, thunkAPI) => {
  try {
    return await getTopRatedMovies();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

export const fetchNowPlaying = createAsyncThunk("movie/fetchNowPlaying", async (_, thunkAPI) => {
  try {
    return await getNowPlayingMovies();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

export const fetchUpcoming = createAsyncThunk("movie/fetchUpcoming", async (_, thunkAPI) => {
  try {
    return await getUpcomingMovies();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

export const fetchSearch = createAsyncThunk("movie/fetchSearch", async (query, thunkAPI) => {
  try {
    return await searchMovies(query);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

export const fetchMovieDetails = createAsyncThunk("movie/fetchMovieDetails", async (tmdbId, thunkAPI) => {
  try {
<<<<<<< HEAD
  
    return await getMovieDetails(tmdbId, true);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

export const fetchMovieSources = createAsyncThunk("movie/fetchMovieSources", async (tmdbId, thunkAPI) => {
  try {
    return await getMovieSources(tmdbId);
=======
    return await getMovieDetails(tmdbId);
>>>>>>> 9f79863cc8a29cab049d0bdaa7f586b2f5c9eb5f
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

<<<<<<< HEAD
=======
// Initial state with all categories
>>>>>>> 9f79863cc8a29cab049d0bdaa7f586b2f5c9eb5f
const initialState = {
  trending: [],
  popular: [],
  topRated: [],
  nowPlaying: [],
  upcoming: [],
  searchResults: [],
<<<<<<< HEAD
  details: null,
  sources: null,
=======
  details: {},
>>>>>>> 9f79863cc8a29cab049d0bdaa7f586b2f5c9eb5f
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
<<<<<<< HEAD
    },
    clearDetails: (state) => {
      state.details = null;
      state.sources = null;
=======
>>>>>>> 9f79863cc8a29cab049d0bdaa7f586b2f5c9eb5f
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
<<<<<<< HEAD
        state.error = action.payload; 
=======
        state.error = action.payload;
        state.trending = []; 
>>>>>>> 9f79863cc8a29cab049d0bdaa7f586b2f5c9eb5f
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
<<<<<<< HEAD
        state.error = action.payload; 
=======
        state.error = action.payload;
        state.popular = []; 
>>>>>>> 9f79863cc8a29cab049d0bdaa7f586b2f5c9eb5f
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
<<<<<<< HEAD
        state.error = action.payload; 
=======
        state.error = action.payload;
        state.topRated = []; 
>>>>>>> 9f79863cc8a29cab049d0bdaa7f586b2f5c9eb5f
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
<<<<<<< HEAD
        state.error = action.payload; 
=======
        state.error = action.payload;
        state.nowPlaying = []; 
>>>>>>> 9f79863cc8a29cab049d0bdaa7f586b2f5c9eb5f
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
<<<<<<< HEAD
        state.error = action.payload; 
=======
        state.error = action.payload;
        state.upcoming = []; 
>>>>>>> 9f79863cc8a29cab049d0bdaa7f586b2f5c9eb5f
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
<<<<<<< HEAD
        state.error = action.payload; 
      })

      // Movie Details (includes sources)
=======
        state.error = action.payload;
        state.searchResults = []; 
      })

      // Details
>>>>>>> 9f79863cc8a29cab049d0bdaa7f586b2f5c9eb5f
      .addCase(fetchMovieDetails.pending, (state) => { 
        state.loading = true; 
        state.error = null; 
      })
      .addCase(fetchMovieDetails.fulfilled, (state, action) => { 
        state.loading = false; 
<<<<<<< HEAD
        state.details = action.payload || null;
        // Extract sources if they exist in the response
        if (action.payload?.moviebox) {
          state.sources = action.payload.moviebox;
        }
      })
      .addCase(fetchMovieDetails.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload; 
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
      .addCase(fetchMovieSources.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload; 
=======
        state.details = action.payload || {}; 
      })
      .addCase(fetchMovieDetails.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload;
        state.details = {}; 
>>>>>>> 9f79863cc8a29cab049d0bdaa7f586b2f5c9eb5f
      });
  },
});

<<<<<<< HEAD
export const { clearSearch, clearError, clearDetails } = movieSlice.actions;
=======
export const { clearSearch, clearError } = movieSlice.actions;
>>>>>>> 9f79863cc8a29cab049d0bdaa7f586b2f5c9eb5f
export default movieSlice.reducer;