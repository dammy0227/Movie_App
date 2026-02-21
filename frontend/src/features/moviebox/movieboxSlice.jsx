import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentVideo: null,      
  currentTitle: null,     
  currentQuality: null,    
  isPlaying: false,        
  downloadProgress: null,  
};

const movieboxSlice = createSlice({
  name: "moviebox",
  initialState,
  reducers: {
   
    playVideo: (state, action) => {
      state.currentVideo = action.payload.url;
      state.currentTitle = action.payload.title;
      state.currentQuality = action.payload.quality;
      state.isPlaying = true;
    },

    closePlayer: (state) => {
      state.currentVideo = null;
      state.currentTitle = null;
      state.currentQuality = null;
      state.isPlaying = false;
    },
    
    setDownloadProgress: (state, action) => {
      state.downloadProgress = action.payload;
    },
  
    clearDownloadProgress: (state) => {
      state.downloadProgress = null;
    },
    
    resetMoviebox: () => initialState,
  },
});

export const selectCurrentVideo = (state) => state.moviebox.currentVideo;
export const selectCurrentTitle = (state) => state.moviebox.currentTitle;
export const selectCurrentQuality = (state) => state.moviebox.currentQuality;
export const selectIsPlaying = (state) => state.moviebox.isPlaying;
export const selectDownloadProgress = (state) => state.moviebox.downloadProgress;

export const { 
  playVideo, 
  closePlayer, 
  setDownloadProgress, 
  clearDownloadProgress,
  resetMoviebox 
} = movieboxSlice.actions;

export default movieboxSlice.reducer;