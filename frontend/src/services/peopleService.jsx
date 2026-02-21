import API from "./api";


export const searchPeople = async (query) => {
  const res = await API.get("/people/search", { params: { query } });
  return res.data;
};


export const getPersonDetails = async (personId) => {
  const res = await API.get(`/people/details/${personId}`);
  return res.data;
};

export const getPopularPeople = async () => {
  const res = await API.get("/people/popular");
  return res.data;
};