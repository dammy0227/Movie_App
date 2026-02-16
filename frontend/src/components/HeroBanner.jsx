import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Info, Play, ChevronLeft, ChevronRight } from 'lucide-react';

const HeroBanner = ({ items = [] }) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || items.length <= 1) return;
    
    const interval = setInterval(() => {
     
    }, 5000); 

    return () => clearInterval(interval);
  }, [currentIndex, isAutoPlaying, items.length]);

  const handlePrevious = () => {
    setIsVisible(false);
    setIsAutoPlaying(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
      setIsVisible(true);
    }, 300);
  };

  const handleNext = () => {
    setIsVisible(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
      setIsVisible(true);
    }, 300);
  };

  const handleDotClick = (index) => {
    if (index === currentIndex) return;
    setIsVisible(false);
    setIsAutoPlaying(false);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsVisible(true);
    }, 300);
  };

  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  if (!items || items.length === 0) return null;

  const currentItem = items[currentIndex];
  const title = currentItem.type === 'tv' ? currentItem.name : currentItem.title;
  const releaseDate = currentItem.type === 'tv' ? currentItem.first_air_date : currentItem.release_date;
  const detailPath = currentItem.type === 'tv' ? `/tv/${currentItem.id}` : `/movie/${currentItem.id}`;

  return (
    <div 
      className="relative h-[80vh] w-full overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={`https://image.tmdb.org/t/p/original${currentItem.backdrop_path}`}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-7000 scale-105 hover:scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black via-black/70 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent" />
      </div>

      {/* Navigation Arrows */}
      {items.length > 1 && (
        <>
          <button
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/60 text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
            aria-label="Previous"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/60 text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
            aria-label="Next"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Content */}
      <div className={`relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center transition-all duration-700 transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}>
        <div className="max-w-2xl">
          {/* Type Badge */}
          <div className="mb-4">
            <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
              currentItem.type === 'tv' 
                ? 'bg-blue-600 text-white' 
                : 'bg-red-600 text-white'
            }`}>
              {currentItem.type === 'tv' ? 'TV Series' : 'Movie'}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
            {title}
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-200 mb-6 line-clamp-3">
            {currentItem.overview}
          </p>
          
          {/* Rating and Metadata */}
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <div className="flex items-center">
              <span className="text-yellow-400 text-xl">★</span>
              <span className="text-white ml-1">{currentItem.vote_average?.toFixed(1)}</span>
            </div>
            <span className="text-gray-400">|</span>
            <span className="text-gray-300">
              {releaseDate ? new Date(releaseDate).getFullYear() : 'N/A'}
            </span>
            {currentItem.type === 'tv' && currentItem.number_of_seasons && (
              <>
                <span className="text-gray-400">|</span>
                <span className="text-gray-300">{currentItem.number_of_seasons} Season{currentItem.number_of_seasons > 1 ? 's' : ''}</span>
              </>
            )}
            {currentItem.type === 'tv' && currentItem.number_of_episodes && (
              <>
                <span className="text-gray-400">|</span>
                <span className="text-gray-300">{currentItem.number_of_episodes} Episode{currentItem.number_of_episodes > 1 ? 's' : ''}</span>
              </>
            )}
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate(detailPath)}
              className="flex items-center justify-center px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition transform hover:scale-105"
            >
              <Play className="w-5 h-5 mr-2" />
              View Details
            </button>
            <button
              onClick={() => navigate(detailPath)}
              className="flex items-center justify-center px-8 py-3 bg-gray-800/80 text-white rounded-lg hover:bg-gray-700 transition backdrop-blur-sm"
            >
              <Info className="w-5 h-5 mr-2" />
              More Info
            </button>
          </div>
        </div>
      </div>

      {/* Progress Indicators */}
      {items.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`transition-all duration-300 ${
                index === currentIndex
                  ? 'w-8 h-2 bg-red-600 rounded-full'
                  : 'w-2 h-2 bg-white/50 hover:bg-white/80 rounded-full'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Current Position Indicator */}
      {items.length > 1 && (
        <div className="absolute top-4 right-4 z-20 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {currentIndex + 1} / {items.length}
        </div>
      )}
    </div>
  );
};

export default HeroBanner;