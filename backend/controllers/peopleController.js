import { 
  searchPeople, 
  getPersonDetails, 
  getPopularPeople 
} from "../utils/tmdbApi.js";

export const searchPerson = async (req, res) => {
  try {
    const { query } = req.query;
    const results = await searchPeople(query);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const personDetails = async (req, res) => {
  try {
    const { personId } = req.params;
    const person = await getPersonDetails(personId);
    res.json(person);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const popularPeople = async (req, res) => {
  try {
    const people = await getPopularPeople();
    res.json(people);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};