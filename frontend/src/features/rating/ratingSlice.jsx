import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  rateItem,
  getUserRatings,
  getItemRating,
  updateRating,
  deleteRating,
  getAverageRating
} from "../../services/ratingService";

// Thunks
export const rateMovie = createAsyncThunk(
  "rating/rateMovie",
  async (itemData, { rejectWithValue }) => {
    try {
      const response = await rateItem(itemData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to rate");
    }
  }
);

export const fetchUserRatings = createAsyncThunk(
  "rating/fetchUserRatings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserRatings();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch ratings");
    }
  }
);

export const fetchItemRating = createAsyncThunk(
  "rating/fetchItemRating",
  async (tmdbId, { rejectWithValue }) => {
    try {
      const response = await getItemRating(tmdbId);
      return { tmdbId, ...response };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch item rating");
    }
  }
);

export const updateUserRating = createAsyncThunk(
  "rating/updateUserRating",
  async ({ tmdbId, rating, review }, { rejectWithValue }) => {
    try {
      const response = await updateRating(tmdbId, { rating, review });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update rating");
    }
  }
);

export const removeRating = createAsyncThunk(
  "rating/removeRating",
  async (tmdbId, { rejectWithValue }) => {
    try {
      const response = await deleteRating(tmdbId);
      return { tmdbId, ...response };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to remove rating");
    }
  }
);

export const fetchAverageRating = createAsyncThunk(
  "rating/fetchAverageRating",
  async (tmdbId, { rejectWithValue }) => {
    try {
      const response = await getAverageRating(tmdbId);
      return { tmdbId, ...response };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch average rating");
    }
  }
);

// Initial state
const initialState = {
  userRatings: [],
  itemRatings: {},
  averageRatings: {}, 
  loading: false,
  error: null,
};

// Slice
const ratingSlice = createSlice({
  name: "rating",
  initialState,
  reducers: {
    clearRatingError: (state) => {
      state.error = null;
    },
    clearItemRating: (state, action) => {
      const { tmdbId } = action.payload;
      delete state.itemRatings[tmdbId];
    },
  },
  extraReducers: (builder) => {
    builder
      // Rate Movie
      .addCase(rateMovie.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rateMovie.fulfilled, (state, action) => {
        state.loading = false;
        const { item } = action.payload;
        state.itemRatings[item.tmdbId] = {
          userRating: item.userRating,
          review: item.review,
          ratedAt: item.ratedAt
        };
      })
      .addCase(rateMovie.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch User Ratings
      .addCase(fetchUserRatings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserRatings.fulfilled, (state, action) => {
        state.loading = false;
        state.userRatings = action.payload;
      })
      .addCase(fetchUserRatings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Item Rating
      .addCase(fetchItemRating.fulfilled, (state, action) => {
        const { tmdbId, userRating, review, ratedAt } = action.payload;
        state.itemRatings[tmdbId] = {
          userRating,
          review,
          ratedAt
        };
      })

      // Update Rating
      .addCase(updateUserRating.fulfilled, (state, action) => {
        const { item } = action.payload;
        state.itemRatings[item.tmdbId] = {
          userRating: item.userRating,
          review: item.review,
          ratedAt: item.ratedAt
        };
        
        // Update in userRatings list if present
        const index = state.userRatings.findIndex(r => r.tmdbId === item.tmdbId);
        if (index !== -1) {
          state.userRatings[index] = item;
        } else {
          state.userRatings.push(item);
        }
      })

      // Remove Rating
      .addCase(removeRating.fulfilled, (state, action) => {
        const { tmdbId } = action.payload;
        delete state.itemRatings[tmdbId];
        state.userRatings = state.userRatings.filter(r => r.tmdbId !== tmdbId);
      })

      // Fetch Average Rating
      .addCase(fetchAverageRating.fulfilled, (state, action) => {
        const { tmdbId, averageRating, totalRatings } = action.payload;
        state.averageRatings[tmdbId] = {
          average: averageRating,
          total: totalRatings
        };
      });
  },
});

export const { clearRatingError, clearItemRating } = ratingSlice.actions;
export default ratingSlice.reducer;