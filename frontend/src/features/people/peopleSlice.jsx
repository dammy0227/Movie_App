import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { 
  searchPeople,
  getPersonDetails,
  getPopularPeople
} from "../../services/peopleService";

// Thunks
export const fetchPeopleSearch = createAsyncThunk("people/fetchPeopleSearch", async (query, thunkAPI) => {
  try {
    return await searchPeople(query);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

export const fetchPersonDetails = createAsyncThunk("people/fetchPersonDetails", async (personId, thunkAPI) => {
  try {
    return await getPersonDetails(personId);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

export const fetchPopularPeople = createAsyncThunk("people/fetchPopularPeople", async (_, thunkAPI) => {
  try {
    return await getPopularPeople();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

// Initial State
const initialState = {
  searchResults: [],
  details: {},
  popular: [],
  loading: false,
  error: null,
};

const peopleSlice = createSlice({
  name: "people",
  initialState,
  reducers: {
    clearPeopleSearch: (state) => {
      state.searchResults = [];
    },
    clearPeopleError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Search
      .addCase(fetchPeopleSearch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPeopleSearch.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload || [];
      })
      .addCase(fetchPeopleSearch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.searchResults = [];
      })

      // Details
      .addCase(fetchPersonDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPersonDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.details = action.payload || {};
      })
      .addCase(fetchPersonDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.details = {};
      })

      // Popular
      .addCase(fetchPopularPeople.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPopularPeople.fulfilled, (state, action) => {
        state.loading = false;
        state.popular = action.payload || [];
      })
      .addCase(fetchPopularPeople.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.popular = [];
      });
  },
});

export const { clearPeopleSearch, clearPeopleError } = peopleSlice.actions;
export default peopleSlice.reducer;