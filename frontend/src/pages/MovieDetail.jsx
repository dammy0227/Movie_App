import { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovieDetails } from '../features/movie/movieSlice';
import { fetchSummary } from '../features/ai/aiSlice';
import { addWatchlist, addHistory } from '../features/user/userSlice';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { Heart, Star, Clock, Calendar, Film, Play, Sparkles, X } from 'lucide-react';

const MovieDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [showAISummary, setShowAISummary] = useState(false);
  
  // State for trailer modal
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerKey, setTrailerKey] = useState('');

  const { details, loading, error } = useSelector((state) => state.movie);
  const { summary, loading: aiLoading } = useSelector((state) => state.ai);

  useEffect(() => {
    dispatch(fetchMovieDetails(id));
  }, [dispatch, id]);

  // Extract trailer key using useMemo instead of useEffect with setState
  const extractedTrailerKey = useMemo(() => {
    if (details?.videos?.results) {
      // Find the first YouTube trailer
      const trailer = details.videos.results.find(
        video => video.type === 'Trailer' && video.site === 'YouTube'
      );
      // If no trailer, try to find a teaser
      const teaser = !trailer ? details.videos.results.find(
        video => video.type === 'Teaser' && video.site === 'YouTube'
      ) : null;
      
      const video = trailer || teaser;
      return video?.key || '';
    }
    return '';
  }, [details]);

  // Update trailerKey when extracted key changes
  useEffect(() => {
    setTrailerKey(extractedTrailerKey);
  }, [extractedTrailerKey]);

  useEffect(() => {
    if (details?.id) {
      dispatch(addHistory({
        tmdbId: details.id,
        title: details.title,
        poster: details.poster_path
      }));
    }
  }, [details, dispatch]);

  const handleAddToWatchlist = useCallback(() => {
    dispatch(addWatchlist({
      tmdbId: details.id,
      omdbId: details.imdb_id,
      title: details.title,
      poster: details.poster_path,
      voteAverage: details.vote_average
    }));
  }, [dispatch, details]);

  const handleAISummary = useCallback(() => {
    if (!showAISummary) {
      dispatch(fetchSummary({ plot: details.overview }));
    }
    setShowAISummary(!showAISummary);
  }, [dispatch, details, showAISummary]);

  const handleWatchTrailer = useCallback(() => {
    if (trailerKey) {
      setShowTrailer(true);
    }
  }, [trailerKey]);

  const handleCloseTrailer = useCallback(() => {
    setShowTrailer(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !details) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="pt-24 px-4">
          <ErrorMessage message={error || 'Movie not found'} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pb-7">
      <Navbar />
      
      {/* Hero Section with Backdrop */}
      <div className="relative h-[60vh] w-full">
        <img
          src={`https://image.tmdb.org/t/p/original${details.backdrop_path}`}
          alt={details.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />
      </div>

      {/* Movie Details */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-48">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="md:w-1/3 lg:w-1/4">
            <img
              src={`https://image.tmdb.org/t/p/w500${details.poster_path}`}
              alt={details.title}
              className="w-full rounded-2xl shadow-2xl"
            />
          </div>

          {/* Info */}
          <div className="md:w-2/3 lg:w-3/4 text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">{details.title}</h1>
            
            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center">
                <Star className="w-5 h-5 text-yellow-400 mr-1" />
                <span>{details.vote_average?.toFixed(1)}</span>
              </div>
              <span>•</span>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                <span>{new Date(details.release_date).getFullYear()}</span>
              </div>
              <span>•</span>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>{details.runtime} min</span>
              </div>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-6">
              {details.genres?.map(genre => (
                <span
                  key={genre.id}
                  className="px-3 py-1 bg-gray-800 rounded-full text-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            {/* Overview */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-2">Overview</h2>
              <p className="text-gray-300 leading-relaxed">{details.overview}</p>
            </div>

            {/* Cast */}
            {details.credits?.cast?.slice(0, 5).length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-3">Cast</h2>
                <div className="flex flex-wrap gap-4">
                  {details.credits.cast.slice(0, 5).map(actor => (
                    <div key={actor.id} className="text-center">
                      <div className="w-16 h-16 rounded-full bg-gray-700 overflow-hidden mb-2">
                        {actor.profile_path ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                            alt={actor.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Film className="w-6 h-6 text-gray-500" />
                          </div>
                        )}
                      </div>
                      <p className="text-sm font-medium">{actor.name}</p>
                      <p className="text-xs text-gray-400">{actor.character}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleAddToWatchlist}
                className="flex items-center px-6 py-3 bg-red-600 rounded-lg hover:bg-red-700 transition"
              >
                <Heart className="w-5 h-5 mr-2" />
                Add to Watchlist
              </button>
              
              <button
                onClick={handleAISummary}
                className="flex items-center px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-700 transition"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                AI Summary
              </button>

              <button
                onClick={handleWatchTrailer}
                disabled={!trailerKey}
                className={`flex items-center px-6 py-3 rounded-lg transition ${
                  trailerKey 
                    ? 'bg-gray-800 hover:bg-gray-700' 
                    : 'bg-gray-800/50 cursor-not-allowed'
                }`}
              >
                <Play className="w-5 h-5 mr-2" />
                {trailerKey ? 'Watch Trailer' : 'No Trailer Available'}
              </button>
            </div>

            {/* AI Summary Display */}
            {showAISummary && (
              <div className="mt-6 p-4 bg-purple-600/20 border border-purple-600 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-400 mb-2 flex items-center">
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI Summary
                </h3>
                {aiLoading ? (
                  <LoadingSpinner />
                ) : (
                  <p className="text-gray-300">{summary || 'No summary available.'}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      {showTrailer && trailerKey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95">
          <div className="relative w-full max-w-6xl">
            {/* Close button */}
            <button
              onClick={handleCloseTrailer}
              className="absolute -top-12 right-0 text-white hover:text-red-600 transition flex items-center gap-2"
            >
              <span>Close</span>
              <X className="w-6 h-6" />
            </button>
            
            {/* Video container */}
            <div className="relative pt-[56.25%] bg-black rounded-lg overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&modestbranding=1&rel=0`}
                className="absolute top-0 left-0 w-full h-full"
                allowFullScreen
                allow="autoplay; encrypted-media"
                title={`${details.title} Trailer`}
              />
            </div>
            
            {/* Trailer info */}
            <div className="mt-4 text-white">
              <h3 className="text-xl font-semibold">{details.title} - Trailer</h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetail;