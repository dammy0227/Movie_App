import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUserRatings, removeRating } from '../features/rating/ratingSlice';
import Navbar from '../components/Navbar';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Star, Trash2, Calendar, Film, Tv } from 'lucide-react';

const Ratings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all'); 
  
  const { userRatings, loading } = useSelector((state) => state.rating);

  useEffect(() => {
    dispatch(fetchUserRatings());
  }, [dispatch]);

  const handleRemoveRating = async (tmdbId, e) => {
    e.stopPropagation();
    if (window.confirm('Remove your rating?')) {
      await dispatch(removeRating(tmdbId));
      dispatch(fetchUserRatings()); 
    }
  };

  const filteredRatings = userRatings.filter(item => {
    if (filter === 'movies') return !item.media_type || item.media_type === 'movie';
    if (filter === 'tv') return item.media_type === 'tv';
    return true;
  });

  const moviesCount = userRatings.filter(r => !r.media_type || r.media_type === 'movie').length;
  const tvCount = userRatings.filter(r => r.media_type === 'tv').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="pt-24 flex justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pb-10">
      <Navbar />
      
      <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Star className="w-8 h-8 text-yellow-400 mr-3 fill-current" />
          <h1 className="text-3xl sm:text-4xl font-bold text-white">My Ratings</h1>
          <span className="ml-4 text-sm text-gray-400">
            {userRatings.length} total ratings
          </span>
        </div>

        {/* Filter Tabs */}
        {userRatings.length > 0 && (
          <div className="flex gap-2 mb-8">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition flex items-center ${
                filter === 'all'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              All ({userRatings.length})
            </button>
            <button
              onClick={() => setFilter('movies')}
              className={`px-4 py-2 rounded-lg transition flex items-center ${
                filter === 'movies'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Film className="w-4 h-4 mr-2" />
              Movies ({moviesCount})
            </button>
            <button
              onClick={() => setFilter('tv')}
              className={`px-4 py-2 rounded-lg transition flex items-center ${
                filter === 'tv'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Tv className="w-4 h-4 mr-2" />
              TV Shows ({tvCount})
            </button>
          </div>
        )}

        {filteredRatings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredRatings.map((item) => (
              <div
                key={item._id}
                onClick={() => navigate(item.media_type === 'tv' ? `/tv/${item.tmdbId}` : `/movie/${item.tmdbId}`)}
                className="bg-gray-900 rounded-lg overflow-hidden cursor-pointer hover:transform hover:scale-105 transition duration-300"
              >
                {/* Poster */}
                <div className="relative aspect-3/3">
                  <img
                    src={item.poster 
                      ? `https://image.tmdb.org/t/p/w500${item.poster}`
                      : 'https://via.placeholder.com/500x750?text=No+Poster'
                    }
                    alt={item.title}
                    className="w-full h-90 object-cover"
                  />
                  
                  {/* Rating Badge */}
                  <div className="absolute top-2 left-2 bg-yellow-400 text-black font-bold px-2 py-1 rounded-lg flex items-center">
                    <Star className="w-4 h-4 fill-current mr-1" />
                    {item.userRating}/10
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={(e) => handleRemoveRating(item.tmdbId, e)}
                    className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="text-white font-semibold mb-1 line-clamp-1">{item.title}</h3>
                  
                  <div className="flex items-center text-sm text-gray-400 mb-2">
                    <Calendar className="w-3 h-3 mr-1" />
                    {item.release_date?.slice(0, 4) || 'N/A'}
                    <span className="mx-2">•</span>
                    {item.media_type === 'tv' ? 'TV Show' : 'Movie'}
                  </div>

                  {/* Review Preview */}
                  {item.review && (
                    <p className="text-sm text-gray-300 line-clamp-2 italic">
                      "{item.review}"
                    </p>
                  )}

                  {/* Rated Date */}
                  <p className="text-xs text-gray-500 mt-2">
                    Rated on {new Date(item.ratedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Star className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-4">No ratings yet</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate('/movies')}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Browse Movies
              </button>
              <button
                onClick={() => navigate('/tv')}
                className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
              >
                Browse TV Shows
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Ratings;