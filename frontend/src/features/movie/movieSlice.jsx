import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { 
  getTrendingMovies, 
  getPopularMovies,
  getTopRatedMovies,
  getNowPlayingMovies,
  getUpcomingMovies,
  searchMovies, 
  getMovieDetails 
} from "../../services/movieService";

// Thunks
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
    return await getMovieDetails(tmdbId);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

// Initial state with all categories
const initialState = {
  trending: [],
  popular: [],
  topRated: [],
  nowPlaying: [],
  upcoming: [],
  searchResults: [],
  details: {},
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
        state.trending = []; 
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
        state.popular = []; 
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
        state.topRated = []; 
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
        state.nowPlaying = []; 
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
        state.upcoming = []; 
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
        state.searchResults = []; 
      })

      // Details
      .addCase(fetchMovieDetails.pending, (state) => { 
        state.loading = true; 
        state.error = null; 
      })
      .addCase(fetchMovieDetails.fulfilled, (state, action) => { 
        state.loading = false; 
        state.details = action.payload || {}; 
      })
      .addCase(fetchMovieDetails.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload;
        state.details = {}; 
      });
  },
});

export const { clearSearch, clearError } = movieSlice.actions;
export default movieSlice.reducer;