import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchTrending } from '../features/movie/movieSlice';
import { fetchTrendingTV, fetchPopularTV, fetchTVDetails } from '../features/tv/tvSlice';
import { fetchPopularPeople, fetchPersonDetails } from '../features/people/peopleSlice';
import { fetchMovieDetails } from '../features/movie/movieSlice';

// Hook to get all trending content
export const useTrendingAll = () => {
  const dispatch = useDispatch();
  
  const { trending: movies = [] } = useSelector((state) => state.movie || {});
  const { trending: tvShows = [] } = useSelector((state) => state.tv || {});
  const { popular: people = [] } = useSelector((state) => state.people || {});
  
  const loading = useSelector((state) => 
    state.movies?.loading || state.tv?.loading || state.people?.loading
  );

  useEffect(() => {
    dispatch(fetchTrending());
    dispatch(fetchTrendingTV());
    dispatch(fetchPopularPeople());
  }, [dispatch]);

  return {
    movies,
    tvShows,
    people,
    loading,
    all: [
      ...movies.slice(0, 5).map(m => ({ ...m, type: 'movie' })),
      ...tvShows.slice(0, 5).map(t => ({ ...t, type: 'tv' })),
      ...people.slice(0, 5).map(p => ({ ...p, type: 'person' }))
    ]
  };
};

// Hook to get popular content
export const usePopularAll = () => {
  const dispatch = useDispatch();
  
  const { popular: movies = [] } = useSelector((state) => state.movies || {});
  const { popular: tvShows = [] } = useSelector((state) => state.tv || {});
  const { popular: people = [] } = useSelector((state) => state.people || {});

  useEffect(() => {
    dispatch(fetchPopularTV());
    dispatch(fetchPopularPeople());
    // Movies already have popular from movieSlice
  }, [dispatch]);

  return { movies, tvShows, people };
};

// Hook to get details by media type
export const useDetails = (id, type) => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    if (!id) return;
    
    switch(type) {
      case 'movie':
        dispatch(fetchMovieDetails(id));
        break;
      case 'tv':
        dispatch(fetchTVDetails(id));
        break;
      case 'person':
        dispatch(fetchPersonDetails(id));
        break;
      default:
        break;
    }
  }, [id, type, dispatch]);

  const movieDetails = useSelector((state) => state.movies?.details);
  const tvDetails = useSelector((state) => state.tv?.details);
  const personDetails = useSelector((state) => state.people?.details);
  
  const loading = useSelector((state) => 
    state.movies?.loading || state.tv?.loading || state.people?.loading
  );

  const details = {
    movie: movieDetails,
    tv: tvDetails,
    person: personDetails
  }[type] || {};

  return { details, loading };
};