import API from "./api";

export const rateItem = async (itemData) => {
  const res = await API.post("/ratings/rate", itemData);
  return res.data;
};


export const getUserRatings = async () => {
  const res = await API.get("/ratings/my-ratings");
  return res.data;
};


export const getItemRating = async (tmdbId) => {
  const res = await API.get(`/ratings/item/${tmdbId}`);
  return res.data;
};

export const updateRating = async (tmdbId, ratingData) => {
  const res = await API.put(`/ratings/${tmdbId}`, ratingData);
  return res.data;
};

export const deleteRating = async (tmdbId) => {
  const res = await API.delete(`/ratings/${tmdbId}`);
  return res.data;
};


export const getAverageRating = async (tmdbId) => {
  const res = await API.get(`/ratings/average/${tmdbId}`);
  return res.data;
};