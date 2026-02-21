import API from "./api";


export const getCollectionDetails = async (collectionId) => {
  const res = await API.get(`/collections/details/${collectionId}`);
  return res.data;
};