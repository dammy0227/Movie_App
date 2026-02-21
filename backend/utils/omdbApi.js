import dotenv from "dotenv";
dotenv.config();

import axios from "axios";

const OMDB_KEY = process.env.OMDB_API_KEY;
const OMDB_BASE = "http://www.omdbapi.com/";

export const getMovieRatings = async (imdbId) => {
  const res = await axios.get(OMDB_BASE, {
    params: { i: imdbId, apikey: OMDB_KEY },
  });
  return res.data; 
};
