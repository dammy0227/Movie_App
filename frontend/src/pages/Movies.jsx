import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import MovieRow from '../components/MovieRow';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { 
  fetchTrending, 
  fetchPopular,
  fetchTopRated,
  fetchNowPlaying,
  fetchUpcoming,
  fetchSearch,
  clearSearch
} from '../features/movie/movieSlice';
import { Search } from 'lucide-react';

const Movies = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('trending');
  
  // Safely access state with defaults
  const movieState = useSelector((state) => state.movie || {});
  const { 
    trending = [], 
    popular = [],
    topRated = [],
    nowPlaying = [],
    upcoming = [],
    searchResults = [], 
    loading = false, 
    error = null 
  } = movieState;

  useEffect(() => {
    // Fetch all categories
    dispatch(fetchTrending());
    dispatch(fetchPopular());
    dispatch(fetchTopRated());
    dispatch(fetchNowPlaying());
    dispatch(fetchUpcoming());
  }, [dispatch]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const delayDebounce = setTimeout(() => {
        dispatch(fetchSearch(searchQuery));
        setActiveCategory('search');
      }, 500);
      return () => clearTimeout(delayDebounce);
    } else {
      // Clear search results when search is empty
      dispatch(clearSearch());
    }
  }, [searchQuery, dispatch]);

  const handleMovieClick = (movie) => {
    navigate(`/movie/${movie.id}`);
  };

  const categories = [
    { id: 'trending', title: 'Trending Now', movies: trending, count: trending.length },
    { id: 'popular', title: 'Popular Movies', movies: popular, count: popular.length },
    { id: 'topRated', title: 'Top Rated', movies: topRated, count: topRated.length },
    { id: 'nowPlaying', title: 'Now Playing', movies: nowPlaying, count: nowPlaying.length },
    { id: 'upcoming', title: 'Upcoming Releases', movies: upcoming, count: upcoming.length },
  ];

  const getDisplayMovies = () => {
    if (activeCategory === 'search') {
      return searchResults;
    }
    const category = categories.find(c => c.id === activeCategory);
    return category?.movies || [];
  };

  const getCategoryTitle = () => {
    if (activeCategory === 'search') {
      return `Search Results for "${searchQuery}"`;
    }
    const category = categories.find(c => c.id === activeCategory);
    return category?.title || 'Movies';
  };

  const displayMovies = getDisplayMovies();

  if (loading && !trending.length && !popular.length) {
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
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {getCategoryTitle()}
          </h1>
          
          {/* Search Bar */}
          <div className="relative max-w-md mb-6">
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>

          {/* Category Tabs */}
          {!searchQuery.trim() && (
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-lg transition flex items-center ${
                    activeCategory === category.id
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {category.title}
                  <span className="ml-2 text-xs bg-gray-700 px-2 py-1 rounded-full">
                    {category.count}
                  </span>
                </button>
              ))}
            </div>
          )}
          
          {/* Results count */}
          {displayMovies.length > 0 && (
            <p className="text-sm text-gray-400">
              Showing {displayMovies.length} movies
            </p>
          )}
        </div>

        {error && <ErrorMessage message={error} />}

        {displayMovies.length > 0 ? (
          <MovieRow
            title=""
            movies={displayMovies}
            onMovieClick={handleMovieClick}
          />
        ) : (
          !loading && (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg mb-4">No movies found</p>
              {searchQuery.trim() && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('trending');
                  }}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Clear Search
                </button>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Movies;