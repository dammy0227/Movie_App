import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { fetchMultiSearch } from '../features/search/searchSlice';

// Hook for multi-search (movies, TV, people all at once)
export const useMultiSearch = (query) => {
  const dispatch = useDispatch();
  const { movies, tv, people, loading } = useSelector((state) => state.search || {});
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (debouncedQuery) {
      dispatch(fetchMultiSearch(debouncedQuery));
    }
  }, [debouncedQuery, dispatch]);

  return {
    movies: movies || [],
    tvShows: tv || [],
    people: people || [],
    loading,
    query: debouncedQuery,
    hasResults: (movies?.length > 0 || tv?.length > 0 || people?.length > 0)
  };
};

// Hook to get search results by type
export const useSearchByType = (query, type = 'all') => {
  const results = useMultiSearch(query);
  
  switch(type) {
    case 'movies':
      return { ...results, results: results.movies };
    case 'tv':
      return { ...results, results: results.tvShows };
    case 'people':
      return { ...results, results: results.people };
    default:
      return {
        ...results,
        results: [
          ...results.movies.map(m => ({ ...m, media_type: 'movie' })),
          ...results.tvShows.map(t => ({ ...t, media_type: 'tv' })),
          ...results.people.map(p => ({ ...p, media_type: 'person' }))
        ]
      };
  }
};