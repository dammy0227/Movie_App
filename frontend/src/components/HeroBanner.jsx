import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Info, Play, ChevronLeft, ChevronRight } from 'lucide-react';

const HeroBanner = ({ items = [] }) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const intervalRef = useRef(null);



  const safeIndex = useMemo(() => {
    if (!items.length) return 0;
    return currentIndex >= items.length ? 0 : currentIndex;
  }, [currentIndex, items.length]);



  const handleNext = useCallback(() => {
    if (items.length === 0) return;

    setIsVisible(false);

    setTimeout(() => {
      setCurrentIndex((prev) =>
        prev === items.length - 1 ? 0 : prev + 1
      );
      setIsVisible(true);
    }, 300);
  }, [items.length]);

  const handlePrevious = useCallback(() => {
    if (items.length === 0) return;

    setIsVisible(false);

    setTimeout(() => {
      setCurrentIndex((prev) =>
        prev === 0 ? items.length - 1 : prev - 1
      );
      setIsVisible(true);
    }, 300);
  }, [items.length]);

  const handleDotClick = useCallback(
    (index) => {
      if (index === safeIndex || items.length === 0) return;

      setIsVisible(false);
      setIsAutoPlaying(false);

      setTimeout(() => {
        setCurrentIndex(index);
        setIsVisible(true);
      }, 300);
    },
    [safeIndex, items.length]
  );


  const resetInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (isAutoPlaying && items.length > 1) {
      intervalRef.current = setInterval(() => {
        handleNext();
      }, 5000);
    }
  }, [isAutoPlaying, items.length, handleNext]);

  useEffect(() => {
    resetInterval();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [resetInterval]);

  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);



  if (!items || items.length === 0) return null;

  const currentItem = items[safeIndex];

  const title =
    currentItem.type === 'tv'
      ? currentItem.name
      : currentItem.title;

  const releaseDate =
    currentItem.type === 'tv'
      ? currentItem.first_air_date
      : currentItem.release_date;

  const detailPath =
    currentItem.type === 'tv'
      ? `/tv/${currentItem.id}`
      : `/movie/${currentItem.id}`;



  return (
    <div
      key={items.length} 
      className="relative h-[80vh] w-full overflow-hidden group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background */}
      <div className="absolute inset-0">
        <img
          key={currentItem.id}
          src={`https://image.tmdb.org/t/p/original${currentItem.backdrop_path}`}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-10000 scale-105 hover:scale-110"
          onError={(e) => {
            e.target.src =
              'https://via.placeholder.com/1920x1080?text=No+Image';
          }}
        />
        <div className="absolute inset-0 bg-linear-to-r from-black via-black/70 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent" />
      </div>

      {/* Arrows */}
      {items.length > 1 && (
        <>
          <button
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/80 text-white p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/80 text-white p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Content */}
      <div
        className={`relative h-full max-w-7xl mx-auto px-6 flex items-center transition-all duration-700 transform ${
          isVisible
            ? 'translate-y-0 opacity-100'
            : 'translate-y-10 opacity-0'
        }`}
      >
        <div className="max-w-2xl">
          <span
            className={`inline-block px-3 py-1 text-sm font-semibold rounded-full mb-4 ${
              currentItem.type === 'tv'
                ? 'bg-blue-600'
                : 'bg-red-600'
            }`}
          >
            {currentItem.type === 'tv'
              ? 'TV Series'
              : 'Movie'}
          </span>

          <h1 className="text-5xl font-bold text-white mb-4">
            {title}
          </h1>

          <p className="text-lg text-gray-200 mb-6 line-clamp-3">
            {currentItem.overview}
          </p>

          <div className="flex items-center gap-4 mb-8">
            <span className="text-yellow-400">
              ★ {currentItem.vote_average?.toFixed(1)}
            </span>

            <span className="text-gray-400">|</span>

            <span className="text-gray-300">
              {releaseDate
                ? new Date(releaseDate).getFullYear()
                : 'N/A'}
            </span>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => navigate(detailPath)}
              className="flex items-center px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              <Play className="w-5 h-5 mr-2" />
              View Details
            </button>

            <button
              onClick={() => navigate(detailPath)}
              className="flex items-center px-8 py-3 bg-gray-800/80 text-white rounded-lg hover:bg-gray-700 transition"
            >
              <Info className="w-5 h-5 mr-2" />
              More Info
            </button>
          </div>
        </div>
      </div>

      {/* Dots */}
      {items.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`transition-all duration-300 ${
                index === safeIndex
                  ? 'w-8 h-2 bg-red-600 rounded-full'
                  : 'w-2 h-2 bg-white/50 rounded-full'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroBanner;