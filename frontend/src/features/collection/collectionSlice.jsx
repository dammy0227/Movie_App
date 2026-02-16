import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCollectionDetails } from "../../services/collectionService";

// Thunks
export const fetchCollectionDetails = createAsyncThunk("collection/fetchCollectionDetails", async (collectionId, thunkAPI) => {
  try {
    return await getCollectionDetails(collectionId);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

// Initial State
const initialState = {
  details: {},
  loading: false,
  error: null,
};

const collectionSlice = createSlice({
  name: "collection",
  initialState,
  reducers: {
    clearCollection: (state) => {
      state.details = {};
    },
    clearCollectionError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Collection Details
      .addCase(fetchCollectionDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCollectionDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.details = action.payload || {};
      })
      .addCase(fetchCollectionDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.details = {};
      });
  },
});

export const { clearCollection, clearCollectionError } = collectionSlice.actions;
export default collectionSlice.reducer;