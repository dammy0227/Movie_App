import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { 
  fetchTVSearch,
  fetchTrendingTV,
  fetchPopularTV,
  fetchTopRatedTV,
  fetchAiringTodayTV,
  fetchOnTheAirTV,
  fetchTVDetails
} from '../features/tv/tvSlice';

// Hook for searching TV shows with debounce
export const useTVSearch = (query) => {
  const dispatch = useDispatch();
  const { searchResults, loading } = useSelector((state) => state.tv || {});
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (debouncedQuery) {
      dispatch(fetchTVSearch(debouncedQuery));
    }
  }, [debouncedQuery, dispatch]);

  return { results: searchResults || [], loading };
};

// Hook for TV show details
export const useTVDetails = (tvId) => {
  const dispatch = useDispatch();
  const { details, loading } = useSelector((state) => state.tv || {});

  useEffect(() => {
    if (tvId) {
      dispatch(fetchTVDetails(tvId));
    }
  }, [tvId, dispatch]);

  return { details: details || {}, loading };
};

// Hook for trending TV shows
export const useTrendingTV = () => {
  const dispatch = useDispatch();
  const { trending, loading } = useSelector((state) => state.tv || {});

  useEffect(() => {
    dispatch(fetchTrendingTV());
  }, [dispatch]);

  return { shows: trending || [], loading };
};

// Hook for popular TV shows
export const usePopularTV = () => {
  const dispatch = useDispatch();
  const { popular, loading } = useSelector((state) => state.tv || {});

  useEffect(() => {
    dispatch(fetchPopularTV());
  }, [dispatch]);

  return { shows: popular || [], loading };
};

// Hook for top rated TV shows
export const useTopRatedTV = () => {
  const dispatch = useDispatch();
  const { topRated, loading } = useSelector((state) => state.tv || {});

  useEffect(() => {
    dispatch(fetchTopRatedTV());
  }, [dispatch]);

  return { shows: topRated || [], loading };
};

// Hook for airing today TV shows
export const useAiringTodayTV = () => {
  const dispatch = useDispatch();
  const { airingToday, loading } = useSelector((state) => state.tv || {});

  useEffect(() => {
    dispatch(fetchAiringTodayTV());
  }, [dispatch]);

  return { shows: airingToday || [], loading };
};

// Hook for on the air TV shows
export const useOnTheAirTV = () => {
  const dispatch = useDispatch();
  const { onTheAir, loading } = useSelector((state) => state.tv || {});

  useEffect(() => {
    dispatch(fetchOnTheAirTV());
  }, [dispatch]);

  return { shows: onTheAir || [], loading };
};

// Combined hook for all TV categories
export const useAllTV = () => {
  const dispatch = useDispatch();
  const { 
    trending = [], 
    popular = [], 
    topRated = [], 
    airingToday = [], 
    onTheAir = [], 
    loading 
  } = useSelector((state) => state.tv || {});

  useEffect(() => {
    dispatch(fetchTrendingTV());
    dispatch(fetchPopularTV());
    dispatch(fetchTopRatedTV());
    dispatch(fetchAiringTodayTV());
    dispatch(fetchOnTheAirTV());
  }, [dispatch]);

  return {
    trending,
    popular,
    topRated,
    airingToday,
    onTheAir,
    loading
  };
};