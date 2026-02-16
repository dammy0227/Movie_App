import { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTVDetails } from '../features/tv/tvSlice';
import { fetchSummary } from '../features/ai/aiSlice';
import { addWatchlist } from '../features/user/userSlice';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { Heart, Star, Calendar, Film, Play, Sparkles, X } from 'lucide-react';

const TVDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [showTrailer, setShowTrailer] = useState(false);
  const [showAISummary, setShowAISummary] = useState(false);
  const [trailerKey, setTrailerKey] = useState('');

  const { details, loading, error } = useSelector((state) => state.tv || {});
  const { summary, loading: aiLoading } = useSelector((state) => state.ai || {});

  useEffect(() => {
    dispatch(fetchTVDetails(id));
  }, [dispatch, id]);

  // Extract trailer key using useMemo instead of useEffect with setState
  const extractedTrailerKey = useMemo(() => {
    if (details?.videos?.results) {
      const trailer = details.videos.results.find(
        video => video.type === 'Trailer' && video.site === 'YouTube'
      );
      return trailer?.key || '';
    }
    return '';
  }, [details]);

  // Update trailerKey when extracted key changes
  useEffect(() => {
    setTrailerKey(extractedTrailerKey);
  }, [extractedTrailerKey]);

  const handleAddToWatchlist = useCallback(() => {
    dispatch(addWatchlist({
      tmdbId: details.id,
      title: details.name,
      poster: details.poster_path,
      voteAverage: details.vote_average,
      media_type: 'tv',
      release_date: details.first_air_date
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

  if (loading) return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="pt-24 flex justify-center">
        <LoadingSpinner />
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="pt-24 px-4">
        <ErrorMessage message={error} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="relative h-[60vh] w-full">
        <img
          src={`https://image.tmdb.org/t/p/original${details.backdrop_path}`}
          alt={details.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 -mt-48 pb-16">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3 lg:w-1/4">
            <img
              src={`https://image.tmdb.org/t/p/w500${details.poster_path}`}
              alt={details.name}
              className="w-full rounded-2xl shadow-2xl"
            />
          </div>

          <div className="md:w-2/3 text-white">
            <h1 className="text-4xl font-bold mb-2">{details.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center">
                <Star className="w-5 h-5 text-yellow-400 mr-1" />
                <span>{details.vote_average?.toFixed(1)}</span>
              </div>
              <span>•</span>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                <span>{details.first_air_date?.slice(0, 4)}</span>
              </div>
              <span>•</span>
              <span>{details.number_of_seasons} Seasons</span>
              <span>•</span>
              <span>{details.number_of_episodes} Episodes</span>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {details.genres?.map(genre => (
                <span key={genre.id} className="px-3 py-1 bg-gray-800 rounded-full text-sm">
                  {genre.name}
                </span>
              ))}
            </div>

            <p className="text-gray-300 leading-relaxed mb-8">{details.overview}</p>

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
                  trailerKey ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-800/50 cursor-not-allowed'
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
            <button
              onClick={handleCloseTrailer}
              className="absolute -top-12 right-0 text-white hover:text-red-600 transition flex items-center gap-2"
            >
              <span>Close</span>
              <X className="w-6 h-6" />
            </button>
            <div className="relative pt-[56.25%]">
              <iframe
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
                className="absolute top-0 left-0 w-full h-full"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TVDetail;