import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { 
  searchTVShows,
  getTVShowDetails,
  getTrendingTVShows,
  getPopularTVShows,
  getTopRatedTVShows,
  getAiringTodayTVShows,
  getOnTheAirTVShows,
  getTVEpisodeSources
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
    // Include sources by default
    return await getTVShowDetails(tvId, true);
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
    clearTVDetails: (state) => {
      state.details = null;
      state.episodeSources = null;
    }
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
        state.searchResults = [];
      })

      // Details
      .addCase(fetchTVDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTVDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.details = action.payload || null;
      })
      .addCase(fetchTVDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.details = {};
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
        state.trending = [];
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
        state.popular = [];
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
        state.topRated = [];
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
        state.airingToday = [];
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
        state.onTheAir = [];
      });
  },
});

export const { clearTVSearch, clearTVError, clearTVDetails } = tvSlice.actions;
export default tvSlice.reducer;