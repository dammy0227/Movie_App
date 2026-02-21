import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { 
  searchTVShows,
  getTVShowDetails,
  getTrendingTVShows,
  getPopularTVShows,
  getTopRatedTVShows,
  getAiringTodayTVShows,
<<<<<<< HEAD
  getOnTheAirTVShows,
  getTVEpisodeSources
=======
  getOnTheAirTVShows
>>>>>>> 9f79863cc8a29cab049d0bdaa7f586b2f5c9eb5f
} from "../../services/tvService";

// Thunks
export const fetchTVSearch = createAsyncThunk("tv/fetchTVSearch", async (query, thunkAPI) => {
  try {
    return await searchTVShows(query);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

export const fetchTVDetails = createAsyncThunk("tv/fetchTVDetails", async (tvId, thunkAPI) => {
  try {
<<<<<<< HEAD
    // Include sources by default
    return await getTVShowDetails(tvId, true);
=======
    return await getTVShowDetails(tvId);
>>>>>>> 9f79863cc8a29cab049d0bdaa7f586b2f5c9eb5f
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

export const fetchTrendingTV = createAsyncThunk("tv/fetchTrendingTV", async (_, thunkAPI) => {
  try {
    return await getTrendingTVShows();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

export const fetchPopularTV = createAsyncThunk("tv/fetchPopularTV", async (_, thunkAPI) => {
  try {
    return await getPopularTVShows();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

export const fetchTopRatedTV = createAsyncThunk("tv/fetchTopRatedTV", async (_, thunkAPI) => {
  try {
    return await getTopRatedTVShows();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

export const fetchAiringTodayTV = createAsyncThunk("tv/fetchAiringTodayTV", async (_, thunkAPI) => {
  try {
    return await getAiringTodayTVShows();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

export const fetchOnTheAirTV = createAsyncThunk("tv/fetchOnTheAirTV", async (_, thunkAPI) => {
  try {
    return await getOnTheAirTVShows();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

<<<<<<< HEAD
export const fetchTVEpisodeSources = createAsyncThunk(
  "tv/fetchTVEpisodeSources", 
  async ({ tvId, season, episode }, thunkAPI) => {
    try {
      return await getTVEpisodeSources(tvId, season, episode);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Initial State
const initialState = {
  searchResults: [],
  details: null,
  episodeSources: null,
=======
// Initial State
const initialState = {
  searchResults: [],
  details: {},
>>>>>>> 9f79863cc8a29cab049d0bdaa7f586b2f5c9eb5f
  trending: [],
  popular: [],
  topRated: [],
  airingToday: [],
  onTheAir: [],
  loading: false,
  error: null,
};

const tvSlice = createSlice({
  name: "tv",
  initialState,
  reducers: {
    clearTVSearch: (state) => {
      state.searchResults = [];
    },
    clearTVError: (state) => {
      state.error = null;
    },
<<<<<<< HEAD
    clearTVDetails: (state) => {
      state.details = null;
      state.episodeSources = null;
    }
=======
>>>>>>> 9f79863cc8a29cab049d0bdaa7f586b2f5c9eb5f
  },
  extraReducers: (builder) => {
    builder
      // Search
      .addCase(fetchTVSearch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTVSearch.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload || [];
      })
      .addCase(fetchTVSearch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
<<<<<<< HEAD
=======
        state.searchResults = [];
>>>>>>> 9f79863cc8a29cab049d0bdaa7f586b2f5c9eb5f
      })

      // Details
      .addCase(fetchTVDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTVDetails.fulfilled, (state, action) => {
        state.loading = false;
<<<<<<< HEAD
        state.details = action.payload || null;
=======
        state.details = action.payload || {};
>>>>>>> 9f79863cc8a29cab049d0bdaa7f586b2f5c9eb5f
      })
      .addCase(fetchTVDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
<<<<<<< HEAD
      })

      // Episode Sources
      .addCase(fetchTVEpisodeSources.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTVEpisodeSources.fulfilled, (state, action) => {
        state.loading = false;
        state.episodeSources = action.payload || null;
      })
      .addCase(fetchTVEpisodeSources.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
=======
        state.details = {};
>>>>>>> 9f79863cc8a29cab049d0bdaa7f586b2f5c9eb5f
      })

      // Trending
      .addCase(fetchTrendingTV.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrendingTV.fulfilled, (state, action) => {
        state.loading = false;
        state.trending = action.payload || [];
      })
      .addCase(fetchTrendingTV.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
<<<<<<< HEAD
=======
        state.trending = [];
>>>>>>> 9f79863cc8a29cab049d0bdaa7f586b2f5c9eb5f
      })

      // Popular
      .addCase(fetchPopularTV.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPopularTV.fulfilled, (state, action) => {
        state.loading = false;
        state.popular = action.payload || [];
      })
      .addCase(fetchPopularTV.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
<<<<<<< HEAD
=======
        state.popular = [];
>>>>>>> 9f79863cc8a29cab049d0bdaa7f586b2f5c9eb5f
      })

      // Top Rated
      .addCase(fetchTopRatedTV.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopRatedTV.fulfilled, (state, action) => {
        state.loading = false;
        state.topRated = action.payload || [];
      })
      .addCase(fetchTopRatedTV.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
<<<<<<< HEAD
=======
        state.topRated = [];
>>>>>>> 9f79863cc8a29cab049d0bdaa7f586b2f5c9eb5f
      })

      // Airing Today
      .addCase(fetchAiringTodayTV.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAiringTodayTV.fulfilled, (state, action) => {
        state.loading = false;
        state.airingToday = action.payload || [];
      })
      .addCase(fetchAiringTodayTV.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
<<<<<<< HEAD
=======
        state.airingToday = [];
>>>>>>> 9f79863cc8a29cab049d0bdaa7f586b2f5c9eb5f
      })

      // On The Air
      .addCase(fetchOnTheAirTV.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOnTheAirTV.fulfilled, (state, action) => {
        state.loading = false;
        state.onTheAir = action.payload || [];
      })
      .addCase(fetchOnTheAirTV.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
<<<<<<< HEAD
=======
        state.onTheAir = [];
>>>>>>> 9f79863cc8a29cab049d0bdaa7f586b2f5c9eb5f
      });
  },
});

<<<<<<< HEAD
export const { clearTVSearch, clearTVError, clearTVDetails } = tvSlice.actions;
=======
export const { clearTVSearch, clearTVError } = tvSlice.actions;
>>>>>>> 9f79863cc8a29cab049d0bdaa7f586b2f5c9eb5f
export default tvSlice.reducer;