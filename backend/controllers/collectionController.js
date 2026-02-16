import { getCollectionDetails } from "../utils/tmdbApi.js";

export const collectionDetails = async (req, res) => {
  try {
    const { collectionId } = req.params;
    const collection = await getCollectionDetails(collectionId);
    res.json(collection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};