import API from "./api";

<<<<<<< HEAD

=======
>>>>>>> 9f79863cc8a29cab049d0bdaa7f586b2f5c9eb5f
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

<<<<<<< HEAD

=======
>>>>>>> 9f79863cc8a29cab049d0bdaa7f586b2f5c9eb5f
export const searchMovies = async (query) => {
  const res = await API.get("/movies/search", { params: { query } });
  return res.data;
};

<<<<<<< HEAD

export const getMovieDetails = async (tmdbId, includeSources = false) => {
  const res = await API.get(`/movies/details/${tmdbId}`, {
    params: { includeSources }
  });
  return res.data;
};

export const getMovieSources = async (tmdbId) => {
  const res = await API.get(`/movies/sources/${tmdbId}`);
=======
export const getMovieDetails = async (tmdbId) => {
  const res = await API.get(`/movies/details/${tmdbId}`);
>>>>>>> 9f79863cc8a29cab049d0bdaa7f586b2f5c9eb5f
  return res.data;
};