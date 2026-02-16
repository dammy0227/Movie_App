import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchSearch, 
  fetchTrending, 
  fetchPopular, 
  fetchTopRated, 
  fetchNowPlaying, 
  fetchUpcoming,
  fetchMovieDetails 
} from '../features/movie/movieSlice';
import { useState, useEffect } from 'react';

export const useSearch = (query) => {
  const dispatch = useDispatch();
  const { searchResults, loading } = useSelector((state) => state.movie || {});
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (debouncedQuery) {
      dispatch(fetchSearch(debouncedQuery));
    }
  }, [debouncedQuery, dispatch]);

  return { results: searchResults || [], loading };
};

export const useTrending = () => {
  const dispatch = useDispatch();
  const { trending, loading } = useSelector((state) => state.movies || {});

  useEffect(() => {
    dispatch(fetchTrending());
  }, [dispatch]);

  return { movies: trending || [], loading };
};

export const usePopular = () => {
  const dispatch = useDispatch();
  const { popular, loading } = useSelector((state) => state.movies || {});

  useEffect(() => {
    dispatch(fetchPopular());
  }, [dispatch]);

  return { movies: popular || [], loading };
};

export const useTopRated = () => {
  const dispatch = useDispatch();
  const { topRated, loading } = useSelector((state) => state.movies || {});

  useEffect(() => {
    dispatch(fetchTopRated());
  }, [dispatch]);

  return { movies: topRated || [], loading };
};

export const useNowPlaying = () => {
  const dispatch = useDispatch();
  const { nowPlaying, loading } = useSelector((state) => state.movies || {});

  useEffect(() => {
    dispatch(fetchNowPlaying());
  }, [dispatch]);

  return { movies: nowPlaying || [], loading };
};

export const useUpcoming = () => {
  const dispatch = useDispatch();
  const { upcoming, loading } = useSelector((state) => state.movies || {});

  useEffect(() => {
    dispatch(fetchUpcoming());
  }, [dispatch]);

  return { movies: upcoming || [], loading };
};

export const useMovieDetails = (movieId) => {
  const dispatch = useDispatch();
  const { details, loading } = useSelector((state) => state.movies || {});

  useEffect(() => {
    if (movieId) {
      dispatch(fetchMovieDetails(movieId));
    }
  }, [movieId, dispatch]);

  return { movie: details || {}, loading };
};