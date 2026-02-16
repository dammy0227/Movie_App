import API from "./api";


export const getWatchlist = async () => {
  const res = await API.get("/user/watchlist");
  return res.data;
};


export const addToWatchlist = async (movie) => {
  const res = await API.post("/user/watchlist", movie);
  return res.data;
};


export const addToHistory = async (movie) => {
  const res = await API.post("/user/history", movie);
  return res.data;
};
