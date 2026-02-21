import API from "./api";

export const getAIRecommendation = async (movieData) => {
  const res = await API.post("/ai/recommend", movieData);
  return res.data;
};

export const getAISummary = async (textData) => {
  const res = await API.post("/ai/summary", textData);
  return res.data;
};
