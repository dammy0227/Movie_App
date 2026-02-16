import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchCollectionDetails } from '../features/collection/collectionSlice';

// Hook for collection details
export const useCollection = (collectionId) => {
  const dispatch = useDispatch();
  const { details, loading } = useSelector((state) => state.collection || {});

  useEffect(() => {
    if (collectionId) {
      dispatch(fetchCollectionDetails(collectionId));
    }
  }, [collectionId, dispatch]);

  return {
    collection: details || {},
    movies: details?.parts || [],
    loading
  };
};

// Hook to extract collection from a movie (if it's part of one)
export const useMovieCollection = (movie) => {
  const collectionId = movie?.belongs_to_collection?.id;
  return useCollection(collectionId);
};