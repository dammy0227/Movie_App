import API from "./api";

export const multiSearch = async (query) => {
  const res = await API.get("/search/all", { params: { query } });
  return res.data;
};