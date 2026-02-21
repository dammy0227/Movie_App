import API from "./api";


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

export const getMovieSources = async (tmdbId) => {
  const res = await API.get(`/movies/sources/${tmdbId}`);
  return res.data;
};