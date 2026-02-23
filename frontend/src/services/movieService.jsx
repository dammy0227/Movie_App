import API from "./api";

// Keep all your existing functions unchanged
export const getTrendingMovies = async () => {
  const res = await API.get("/movies/trending");
  return res.data;
};

export const getPopularMovies = async () => {
  const res = await API.get("/movies/popular");
  return res.data;
};

export const getTopRatedMovies = async () => {
  const res = await API.get("/movies/top-rated");
  return res.data;
};

export const getNowPlayingMovies = async () => {
  const res = await API.get("/movies/now-playing");
  return res.data;
};

export const getUpcomingMovies = async () => {
  const res = await API.get("/movies/upcoming");
  return res.data;
};

export const searchMovies = async (query) => {
  const res = await API.get("/movies/search", { params: { query } });
  return res.data;
};

export const getMovieDetails = async (tmdbId, includeSources = false) => {
  const res = await API.get(`/movies/details/${tmdbId}`, {
    params: { includeSources }
  });
  return res.data;
};

// ✅ UPDATED: This now uses Cloudflare Worker
export const getMovieSources = async (tmdbId) => {
  try {
    // Step 1: Get TMDB data from Render (fast)
    const tmdbResponse = await API.get(`/movies/details/${tmdbId}`);
    const tmdbData = tmdbResponse.data;
    
    console.log('🎬 Got TMDB data:', tmdbData.title);
    
    // Step 2: Send TMDB data to Cloudflare Worker
    const WORKER_URL = 'https://movieapp.fatunsindamilare1.workers.dev';
    const workerResponse = await fetch(`${WORKER_URL}/api/moviebox/find-sources`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        tmdbData,
        season: 0,
        episode: 0 
      })
    });
    
    if (!workerResponse.ok) {
      throw new Error(`Worker error: ${workerResponse.status}`);
    }
    
    const data = await workerResponse.json();
    console.log('✅ Got sources from worker:', data);
    return data;
    
  } catch (error) {
    console.error('❌ Worker failed, falling back to Render:', error);
    // Fallback to old method
    const res = await API.get(`/movies/sources/${tmdbId}`);
    return res.data;
  }
};