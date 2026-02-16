import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import MovieModal from '../components/MovieModal';
import { fetchRecommendation } from '../features/ai/aiSlice';
import { Sparkles, Smile, Sword, Heart, Skull, Laugh, Drama, Rocket, Ghost } from 'lucide-react';

const moods = [
  { id: 'happy', label: 'Happy', icon: Smile, color: 'bg-yellow-500', prompt: 'happy uplifting joyful movies' },
  { id: 'action', label: 'Action', icon: Sword, color: 'bg-red-500', prompt: 'exciting action adventure movies' },
  { id: 'romantic', label: 'Romantic', icon: Heart, color: 'bg-pink-500', prompt: 'romantic love story movies' },
  { id: 'scary', label: 'Scary', icon: Ghost, color: 'bg-purple-500', prompt: 'scary horror thriller movies' },
  { id: 'comedy', label: 'Comedy', icon: Laugh, color: 'bg-green-500', prompt: 'funny comedy humorous movies' },
  { id: 'drama', label: 'Drama', icon: Drama, color: 'bg-blue-500', prompt: 'emotional drama movies' },
  { id: 'sci-fi', label: 'Sci-Fi', icon: Rocket, color: 'bg-indigo-500', prompt: 'science fiction futuristic movies' },
  { id: 'thriller', label: 'Thriller', icon: Skull, color: 'bg-orange-500', prompt: 'suspenseful thriller movies' },
];

const AISuggestionsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'modal'
  
  const aiState = useSelector((state) => state.ai || {});
  const { 
    recommendation = [], 
    loading = false, 
    error = null 
  } = aiState;

  const handleMoodClick = (mood) => {
    setSelectedMood(mood);
    dispatch(fetchRecommendation({ prompt: mood.prompt }));
    setShowModal(true); // Show modal by default
  };



  const handleMovieClick = (movie) => {
    navigate(`/movie/${movie.id}`);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMood(null);
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Sparkles className="w-8 h-8 text-yellow-400 mr-3" />
            <h1 className="text-3xl sm:text-4xl font-bold text-white">AI Movie Suggestions</h1>
          </div>
          
          {/* View Toggle - Only show when recommendations exist */}
          {recommendation.length > 0 && !showModal && (
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-lg transition ${
                  viewMode === 'grid' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Grid View
              </button>
              <button
                onClick={() => setShowModal(true)}
                className={`px-4 py-2 rounded-lg transition ${
                  viewMode === 'modal' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Modal View
              </button>
            </div>
          )}
        </div>

        {/* Mood Selection Section */}
        <div className="bg-linear-to-r from-red-600/20 to-purple-600/20 rounded-2xl p-6 sm:p-8 mb-8 backdrop-blur-sm">
          <p className="text-lg sm:text-xl text-gray-300 mb-6 text-center">
            Hello! What kind of movie are you in the mood for?
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {moods.map((mood) => {
              const Icon = mood.icon;
              return (
                <button
                  key={mood.id}
                  onClick={() => handleMoodClick(mood)}
                  className={`${mood.color} group relative overflow-hidden rounded-xl p-4 sm:p-6 transition transform hover:scale-105 hover:shadow-xl`}
                >
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition" />
                  <div className="relative flex flex-col items-center text-white">
                    <Icon className="w-8 h-8 sm:w-10 sm:h-10 mb-2 sm:mb-3" />
                    <span className="font-semibold text-sm sm:text-base">{mood.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Error Display */}
        {error && <ErrorMessage message={error} />}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        )}

        {/* Recommendations Display - Grid View */}
        {recommendation.length > 0 && !showModal && !loading && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Sparkles className="w-6 h-6 text-yellow-400 mr-2" />
              {selectedMood?.label} Movies For You
              <span className="ml-3 text-sm bg-gray-800 px-3 py-1 rounded-full text-gray-300">
                {recommendation.length} recommendations
              </span>
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {recommendation.map((movie) => (
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
                      <div className="absolute inset-0 bg-black/90 opacity-0 group-hover:opacity-100 transition p-4 flex items-center overflow-y-auto">
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
                    {movie.genre_ids && (
                      <p className="text-xs text-gray-500">
                        {movie.genre_ids.slice(0, 2).join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {!loading && !recommendation.length && selectedMood && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              No {selectedMood?.label.toLowerCase()} movies found. Try another mood!
            </p>
          </div>
        )}
      </div>

      {/* Recommendation Modal */}
      {showModal && (
        <MovieModal
          movies={recommendation}
          loading={loading}
          onClose={handleCloseModal}
          title={`${selectedMood?.label} Movies For You`}
        />
      )}
    </div>
  );
};

export default AISuggestionsPage;