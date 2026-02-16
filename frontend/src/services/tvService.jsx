import API from "./api";


export const searchTVShows = async (query) => {
  const res = await API.get("/tv/search", { params: { query } });
  return res.data;
};

export const getTVShowDetails = async (tvId) => {
  const res = await API.get(`/tv/details/${tvId}`);
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