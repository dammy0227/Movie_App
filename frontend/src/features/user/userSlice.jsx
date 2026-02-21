// features/user/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getWatchlist, addToWatchlist, addToHistory } from "../../services/userService";

// Thunks
export const fetchWatchlist = createAsyncThunk("user/fetchWatchlist", async (_, thunkAPI) => {
  try {
    const response = await getWatchlist();
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

export const addWatchlist = createAsyncThunk("user/addWatchlist", async (movie, thunkAPI) => {
  try {
    const response = await addToWatchlist(movie);
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

export const addHistory = createAsyncThunk("user/addHistory", async (movie, thunkAPI) => {
  try {
    return await addToHistory(movie);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

// Slice
const initialState = {
  watchlist: [],
  history: [],
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch watchlist
      .addCase(fetchWatchlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWatchlist.fulfilled, (state, action) => {
        state.loading = false;
        state.watchlist = action.payload || [];
      })
      .addCase(fetchWatchlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.watchlist = [];
      })

      // Add to watchlist
      .addCase(addWatchlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addWatchlist.fulfilled, (state, action) => {
        state.loading = false;
        state.watchlist.push(action.payload);
      })
      .addCase(addWatchlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add to history
      .addCase(addHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.history.push(action.payload);
      })
      .addCase(addHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;