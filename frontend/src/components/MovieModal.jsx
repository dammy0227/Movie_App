import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

const MovieModal = ({ movies, loading, onClose, title }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleMovieClick = (movie) => {
    navigate(`/movie/${movie.id}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative min-h-screen flex items-start justify-center p-4">
        <div className="relative bg-gray-900 rounded-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden mt-16">
          {/* Header */}
          <div className="sticky top-0 bg-gray-900 p-6 border-b border-gray-800 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <span className="mr-2">{title}</span>
              {!loading && movies && (
                <span className="text-sm bg-gray-800 px-3 py-1 rounded-full text-gray-300">
                  {movies.length} movies
                </span>
              )}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-full transition"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-88px)]">
            {loading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner />
              </div>
            ) : movies && movies.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {movies.map((movie) => (
                  <div
                    key={movie.id}
                    className="cursor-pointer group"
                    onClick={() => handleMovieClick(movie)}
                  >
                    <div className="relative overflow-hidden rounded-lg">
                      <img
                        src={movie.poster_path 
                          ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                          : 'https://via.placeholder.com/300x450?text=No+Poster'
                        }
                        alt={movie.title}
                        className="w-full rounded-lg transition transform group-hover:scale-110"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x450?text=No+Poster';
                        }}
                      />
                      
                      {/* AI Summary Overlay */}
                      {movie.ai_summary && (
                        <div className="absolute inset-0 bg-black/90 opacity-0 group-hover:opacity-100 transition p-3 flex items-center overflow-y-auto">
                          <p className="text-xs text-white leading-relaxed">
                            {movie.ai_summary}
                          </p>
                        </div>
                      )}
                      
                      {/* Rating Badge */}
                      <div className="absolute top-2 left-2 bg-black/70 px-2 py-1 rounded text-xs">
                        <span className="text-yellow-400">★</span>
                        <span className="text-white ml-1">{movie.vote_average?.toFixed(1) || '?'}</span>
                      </div>
                    </div>
                    
                    <h3 className="mt-2 text-sm text-white font-medium line-clamp-1">
                      {movie.title}
                    </h3>
                    
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-gray-400">
                        {movie.release_date?.slice(0, 4) || 'N/A'}
                      </p>
                      {movie.vote_average && (
                        <p className="text-xs text-gray-500">
                          {movie.vote_count ? `${movie.vote_count} votes` : ''}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">
                  No movies found. Try another mood!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieModal;