import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { 
  fetchPeopleSearch,
  fetchPersonDetails,
  fetchPopularPeople
} from '../features/people/peopleSlice';

// Hook for searching people with debounce
export const usePeopleSearch = (query) => {
  const dispatch = useDispatch();
  const { searchResults, loading } = useSelector((state) => state.people || {});
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (debouncedQuery) {
      dispatch(fetchPeopleSearch(debouncedQuery));
    }
  }, [debouncedQuery, dispatch]);

  return { results: searchResults || [], loading };
};

// Hook for person details
export const usePersonDetails = (personId) => {
  const dispatch = useDispatch();
  const { details, loading } = useSelector((state) => state.people || {});

  useEffect(() => {
    if (personId) {
      dispatch(fetchPersonDetails(personId));
    }
  }, [personId, dispatch]);

  return { person: details || {}, loading };
};

// Hook for popular people
export const usePopularPeople = () => {
  const dispatch = useDispatch();
  const { popular, loading } = useSelector((state) => state.people || {});

  useEffect(() => {
    dispatch(fetchPopularPeople());
  }, [dispatch]);

  return { people: popular || [], loading };
};

// Hook to get person's movie credits
export const usePersonMovies = (personId) => {
  const { person } = usePersonDetails(personId);
  
  const movies = person?.movie_credits?.cast || [];
  const directed = person?.movie_credits?.crew?.filter(
    job => job.job === 'Director'
  ) || [];
  
  return {
    actedIn: movies,
    directed,
    allMovies: [...movies, ...directed]
  };
};

// Hook to get person's TV credits
export const usePersonTVShows = (personId) => {
  const { person } = usePersonDetails(personId);
  
  const tvShows = person?.tv_credits?.cast || [];
  
  return {
    tvShows
  };
};