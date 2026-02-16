import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchWatchlist } from '../features/user/userSlice';
import Navbar from '../components/Navbar';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Heart, Film, Tv, Play, X } from 'lucide-react';

const Watchlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerKey, setTrailerKey] = useState('');
  const { watchlist, loading } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchWatchlist());
  }, [dispatch]);

  useEffect(() => {
    if (watchlist?.length > 0) {
      console.log('Raw watchlist items:', watchlist);
    }
  }, [watchlist]);


  const movies = watchlist?.filter(item => {
    return !item.media_type || item.media_type === 'movie';
  }) || [];

  const tvShows = watchlist?.filter(item => {
    return item.media_type === 'tv';
  }) || [];

  const handleItemClick = (item) => {
    console.log('Clicking item:', item); 
    
    if (item.media_type === 'tv') {
      navigate(`/tv/${item.tmdbId}`);
    } else {
      navigate(`/movie/${item.tmdbId}`);
    }
  };

  const handleWatchTrailer = (item, e) => {
    e.stopPropagation();
    setSelectedItem(item);
    
    // Determine if it's a TV show or movie for better search
    const isTVShow = item.media_type === 'tv';
    const searchQuery = encodeURIComponent(
      `${item.title} ${isTVShow ? 'TV series' : 'movie'} official trailer`
    );
    window.open(`https://www.youtube.com/results?search_query=${searchQuery}`, '_blank');
  };

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
    <div className="min-h-screen bg-black">
      <Navbar />
      
      <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center mb-8">
          <Heart className="w-8 h-8 text-red-600 mr-3" />
          <h1 className="text-3xl sm:text-4xl font-bold text-white">My Watchlist</h1>
          {watchlist?.length > 0 && (
            <span className="ml-4 text-sm text-gray-400">
              Total: {watchlist.length} items
            </span>
          )}
        </div>

        {watchlist?.length > 0 ? (
          <div className="space-y-12">
            {/* Movies Section */}
            {movies.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <Film className="w-6 h-6 mr-2 text-red-600" />
                  Movies ({movies.length})
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {movies.map((item) => (
                    <div key={item._id} className="relative group">
                      <MovieCard
                        movie={{
                          id: item.tmdbId,
                          title: item.title,
                          poster_path: item.poster,
                          vote_average: item.voteAverage,
                          release_date: item.release_date,
                          media_type: 'movie'
                        }}
                        onClick={() => handleItemClick(item)}
                      />
                      {/* Trailer Button Overlay */}
                      <button
                        onClick={(e) => handleWatchTrailer(item, e)}
                        className="absolute top-2 right-2 z-10 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-700"
                        title="Watch Trailer"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TV Shows Section - Will show when we have items with media_type='tv' */}
            {tvShows.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <Tv className="w-6 h-6 mr-2 text-red-600" />
                  TV Shows ({tvShows.length})
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {tvShows.map((item) => (
                    <div key={item._id} className="relative group">
                      <MovieCard
                        movie={{
                          id: item.tmdbId,
                          title: item.title,
                          poster_path: item.poster,
                          vote_average: item.voteAverage,
                          release_date: item.release_date,
                          media_type: 'tv'
                        }}
                        onClick={() => handleItemClick(item)}
                      />
                      {/* Trailer Button Overlay */}
                      <button
                        onClick={(e) => handleWatchTrailer(item, e)}
                        className="absolute top-2 right-2 z-10 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-700"
                        title="Watch Trailer"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg mb-4">Your watchlist is empty</p>
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

      {/* Trailer Modal */}
      {showTrailer && selectedItem && trailerKey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95">
          <div className="relative w-full max-w-6xl">
            <button
              onClick={() => {
                setShowTrailer(false);
                setTrailerKey('');
              }}
              className="absolute -top-12 right-0 text-white hover:text-red-600 transition flex items-center gap-2"
            >
              <span>Close</span>
              <X className="w-6 h-6" />
            </button>
            <div className="relative pt-[56.25%] bg-black rounded-lg overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
                className="absolute top-0 left-0 w-full h-full"
                allowFullScreen
                allow="autoplay; encrypted-media"
                title={`${selectedItem.title} Trailer`}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Watchlist;