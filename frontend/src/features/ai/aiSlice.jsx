import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAIRecommendation, getAISummary } from "../../services/aiService";

// Thunks
export const fetchRecommendation = createAsyncThunk("ai/fetchRecommendation", async (movieData, thunkAPI) => {
  try {
    return await getAIRecommendation(movieData);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const fetchSummary = createAsyncThunk("ai/fetchSummary", async (textData, thunkAPI) => {
  try {
    return await getAISummary(textData);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Slice
const initialState = {
  recommendation: [],
  summary: "",
  loading: false,
  error: null,
};

const aiSlice = createSlice({
  name: "ai",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Recommendation
      .addCase(fetchRecommendation.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchRecommendation.fulfilled, (state, action) => {
        state.loading = false;
        state.recommendation = action.payload.movies;
      })
      .addCase(fetchRecommendation.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // Summary
      .addCase(fetchSummary.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload.summary;
      })
      .addCase(fetchSummary.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export default aiSlice.reducer;
