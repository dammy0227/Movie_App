import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { multiSearch } from "../../services/searchService";

// Thunks
export const fetchMultiSearch = createAsyncThunk("search/fetchMultiSearch", async (query, thunkAPI) => {
  try {
    return await multiSearch(query);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

// Initial State
const initialState = {
  movies: [],
  tv: [],
  people: [],
  loading: false,
  error: null,
  query: "",
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    clearSearch: (state) => {
      state.movies = [];
      state.tv = [];
      state.people = [];
      state.query = "";
    },
    clearSearchError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Multi Search
      .addCase(fetchMultiSearch.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.query = action.meta.arg; // Store the search query
      })
      .addCase(fetchMultiSearch.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload?.movies || [];
        state.tv = action.payload?.tv || [];
        state.people = action.payload?.people || [];
      })
      .addCase(fetchMultiSearch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.movies = [];
        state.tv = [];
        state.people = [];
      });
  },
});

export const { clearSearch, clearSearchError } = searchSlice.actions;
export default searchSlice.reducer;