import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecommendation } from '../features/ai/aiSlice';
import { Sparkles, Smile, Sword, Heart, Skull, Laugh, Drama, Rocket, Ghost } from 'lucide-react';
import MovieModal from './MovieModal';

const moods = [
  { id: 'happy', label: 'Happy', icon: Smile, color: 'bg-yellow-500', prompt: 'happy uplifting joyful movies' },
  { id: 'action', label: 'Action', icon: Sword, color: 'bg-red-500', prompt: 'exciting action adventure movies' },
  { id: 'romantic', label: 'Romantic', icon: Heart, color: 'bg-pink-500', prompt: 'romantic love story movies' },
  { id: 'scary', label: 'Scary', icon: Skull, color: 'bg-purple-500', prompt: 'scary horror thriller movies' },
  { id: 'comedy', label: 'Comedy', icon: Laugh, color: 'bg-green-500', prompt: 'funny comedy humorous movies' },
  { id: 'drama', label: 'Drama', icon: Drama, color: 'bg-blue-500', prompt: 'emotional drama movies' },
  { id: 'sci-fi', label: 'Sci-Fi', icon: Rocket, color: 'bg-indigo-500', prompt: 'science fiction futuristic movies' },
  { id: 'thriller', label: 'Thriller', icon: Ghost, color: 'bg-orange-500', prompt: 'suspenseful thriller movies' },
];

const AISuggestions = () => {
  const dispatch = useDispatch();
  const [selectedMood, setSelectedMood] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  // Safely access state with defaults
  const aiState = useSelector((state) => state.ai || {});
  const { 
    recommendation = [], 
    loading = false 
  } = aiState;

  const handleMoodClick = (mood) => {
    setSelectedMood(mood);
    dispatch(fetchRecommendation({ prompt: mood.prompt }));
    setShowModal(true);
  };

  return (
    <>
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-linear-to-r from-red-600/20 to-purple-600/20 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
            <div className="flex items-center mb-6">
              <Sparkles className="w-6 h-6 text-yellow-400 mr-2" />
              <h2 className="text-2xl sm:text-3xl font-bold text-white">AI Suggestions</h2>
            </div>
            
            <p className="text-lg text-gray-300 mb-6">
              Hello! What kind of movie are you in the mood for?
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {moods.map((mood) => {
                const Icon = mood.icon;
                return (
                  <button
                    key={mood.id}
                    onClick={() => handleMoodClick(mood)}
                    className={`${mood.color} group relative overflow-hidden rounded-xl p-4 transition transform hover:scale-105 hover:shadow-xl`}
                  >
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition" />
                    <div className="relative flex flex-col items-center text-white">
                      <Icon className="w-8 h-8 mb-2" />
                      <span className="font-semibold">{mood.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Recommendation Modal */}
      {showModal && (
        <MovieModal
          movies={recommendation}
          loading={loading}
          onClose={() => {
            setShowModal(false);
            setSelectedMood(null);
          }}
          title={`${selectedMood?.label} Movies For You`}
        />
      )}
    </>
  );
};

export default AISuggestions;