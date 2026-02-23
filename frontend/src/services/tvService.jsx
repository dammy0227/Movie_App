import API from "./api";

// Keep all your existing functions unchanged
export const searchTVShows = async (query) => {
  const res = await API.get("/tv/search", { params: { query } });
  return res.data;
};

export const getTVShowDetails = async (tvId, includeSources = false) => {
  const res = await API.get(`/tv/details/${tvId}`, {
    params: { includeSources }
  });
  return res.data;
};

export const getTrendingTVShows = async () => {
  const res = await API.get("/tv/trending");
  return res.data;
};

export const getPopularTVShows = async () => {
  const res = await API.get("/tv/popular");
  return res.data;
};

export const getTopRatedTVShows = async () => {
  const res = await API.get("/tv/top-rated");
  return res.data;
};

export const getAiringTodayTVShows = async () => {
  const res = await API.get("/tv/airing-today");
  return res.data;
};

export const getOnTheAirTVShows = async () => {
  const res = await API.get("/tv/on-the-air");
  return res.data;
};

// ✅ UPDATED: This now uses Cloudflare Worker
export const getTVEpisodeSources = async (tvId, season, episode) => {
  try {
    // Step 1: Get TMDB data from Render (fast)
    const tmdbResponse = await API.get(`/tv/details/${tvId}`);
    const tmdbData = tmdbResponse.data;
    
    console.log('📺 Got TV TMDB data:', tmdbData.name);
    
    // Step 2: Send TMDB data to Cloudflare Worker
    const WORKER_URL = 'https://movieapp.fatunsindamilare1.workers.dev';
    const workerResponse = await fetch(`${WORKER_URL}/api/moviebox/find-sources`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        tmdbData,
        season,
        episode 
      })
    });
    
    if (!workerResponse.ok) {
      throw new Error(`Worker error: ${workerResponse.status}`);
    }
    
    const data = await workerResponse.json();
    console.log('✅ Got episode sources from worker:', data);
    return data;
    
  } catch (error) {
    console.error('❌ Worker failed, falling back to Render:', error);
    // Fallback to old method
    const res = await API.get(`/tv/sources/${tvId}`, {
      params: { season, episode }
    });
    return res.data;
  }
};