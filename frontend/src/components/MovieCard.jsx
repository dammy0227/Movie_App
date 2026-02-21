import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addWatchlist } from '../features/user/userSlice';
import { Heart, Info, Check } from 'lucide-react';

const MovieCard = ({ movie, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const dispatch = useDispatch();

  const handleAddToWatchlist = (e) => {
    e.stopPropagation();
    
    setIsAdded(true);
    setShowFeedback(true);
    
    // Get media_type from movie object or default to 'movie'
    const mediaType = movie.media_type || 'movie';
    
    console.log('Adding to watchlist:', { 
      id: movie.id, 
      title: movie.title, 
      mediaType 
    });
    
    dispatch(addWatchlist({
      tmdbId: movie.id,
      title: movie.title,
      poster: movie.poster_path,
      voteAverage: movie.vote_average,
      release_date: movie.release_date,
      media_type: mediaType  // ADD THIS
    }));
    
    setTimeout(() => {
      setShowFeedback(false);
    }, 2000);
  };

  const posterUrl = imageError || !movie.poster_path
    ? 'https://via.placeholder.com/300x450?text=No+Poster'
    : `https://image.tmdb.org/t/p/w300${movie.poster_path}`;

  return (
    <div
      className="relative group cursor-pointer transition transform hover:scale-105 hover:z-10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="relative rounded-lg overflow-hidden">
        <img
          src={posterUrl}
          alt={movie.title}
          className="w-full h-56.25 sm:h-75 object-cover"
          onError={() => setImageError(true)}
          loading="lazy"
        />
        
        {/* Overlay */}
        <div className={`absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent transition-opacity ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`} />
        
        {/* Rating */}
        <div className="absolute top-2 left-2 bg-black/60 px-2 py-1 rounded text-sm">
          <span className="text-yellow-400">★</span>
          <span className="text-white ml-1">{movie.vote_average?.toFixed(1) || '?'}</span>
        </div>

        {/* Added to Watchlist Feedback */}
        {showFeedback && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold animate-bounce">
            Added!
          </div>
        )}

        {/* Actions */}
        <div className={`absolute bottom-0 left-0 right-0 p-4 transform transition ${
          isHovered ? 'translate-y-0' : 'translate-y-full'
        }`}>
          <div className="flex justify-center space-x-2">
            <button
              onClick={handleAddToWatchlist}
              className={`p-2 rounded-full transition transform hover:scale-110 ${
                isAdded 
                  ? 'bg-green-500 hover:bg-green-600' 
                  : 'bg-red-600 hover:bg-red-700'
              }`}
              title={isAdded ? "Added to Watchlist" : "Add to Watchlist"}
            >
              {isAdded ? (
                <Check className="w-4 h-4 text-white animate-pulse" />
              ) : (
                <Heart className="w-4 h-4 text-white" />
              )}
            </button>
            <button
              onClick={onClick}
              className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition transform hover:scale-110"
              title="View Details"
            >
              <Info className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Title */}
      <h3 className="mt-2 text-sm sm:text-base text-white font-medium line-clamp-1">
        {movie.title}
      </h3>
      
      {/* Year */}
      <p className="text-xs text-gray-400">
        {movie.release_date?.slice(0, 4) || 'N/A'}
      </p>
    </div>
  );
};

export default MovieCard;