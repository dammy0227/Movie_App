import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard';

const MovieRow = ({ title, movies, onMovieClick }) => {
  const rowRef = useRef(null);
  const [isMoved, setIsMoved] = useState(false);

  const handleClick = (direction) => {
    setIsMoved(true);
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth
        : scrollLeft + clientWidth;
      
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  // Check scroll position to show/hide left arrow
  const handleScroll = () => {
    if (rowRef.current) {
      setIsMoved(rowRef.current.scrollLeft > 0);
    }
  };

  if (!movies || !Array.isArray(movies) || movies.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <h2 className="text-xl sm:text-2xl font-bold text-white px-4 sm:px-6 lg:px-8">
        {title} <span className="text-sm text-gray-400 ml-2">({movies.length} movies)</span>
      </h2>
      
      <div className="group relative">
        {/* Left Arrow */}
        <button
          onClick={() => handleClick('left')}
          className={`absolute left-2 top-1/2 -translate-y-1/2 z-40 bg-black/50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-black/70 ${
            !isMoved ? 'hidden' : ''
          }`}
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>

        {/* Movie Row */}
        <div
          ref={rowRef}
          onScroll={handleScroll}
          className="flex space-x-4 overflow-x-scroll scrollbar-hide px-4 sm:px-6 lg:px-8 pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map((movie) => (
            <div key={movie.id} className="flex-none w-37.5 sm:w-50">
              <MovieCard movie={movie} onClick={() => onMovieClick(movie)} />
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => handleClick('right')}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-40 bg-black/50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-black/70"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  );
};

export default MovieRow;