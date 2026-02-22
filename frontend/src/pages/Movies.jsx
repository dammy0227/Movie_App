import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom'; 
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
  const location = useLocation(); 
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('trending');
  const [isSearching, setIsSearching] = useState(false);
  
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

  // Read category from URL on component mount and when URL changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    if (category && ['trending', 'popular', 'topRated', 'nowPlaying', 'upcoming'].includes(category)) {
      setActiveCategory(category);
    } else {
      setActiveCategory('trending');
    }
  }, [location.search]);

  // Fetch all categories
  useEffect(() => {
    dispatch(fetchTrending());
    dispatch(fetchPopular());
    dispatch(fetchTopRated());
    dispatch(fetchNowPlaying());
    dispatch(fetchUpcoming());
  }, [dispatch]);

  // Handle search
  useEffect(() => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      const delayDebounce = setTimeout(async () => {
        try {
          await dispatch(fetchSearch(searchQuery));
          setActiveCategory('search');
          navigate(`/movies?search=${encodeURIComponent(searchQuery)}`, { replace: true });
        } finally {
          setIsSearching(false);
        }
      }, 500);
      return () => {
        clearTimeout(delayDebounce);
        setIsSearching(false);
      };
    } else {
      dispatch(clearSearch());
      setIsSearching(false);
      // If search is cleared and no category in URL, set to trending
      const params = new URLSearchParams(location.search);
      if (!params.get('category')) {
        navigate('/movies?category=trending', { replace: true });
      }
    }
  }, [searchQuery, dispatch, navigate, location.search]);

  const handleMovieClick = (movie) => {
    navigate(`/movie/${movie.id}`);
  };

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    setSearchQuery(''); // Clear search when changing category
    navigate(`/movies?category=${categoryId}`);
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
          
          {/* Search Bar with Loading Indicator */}
          <div className="relative max-w-md mb-6">
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 pr-12 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            
            {/* Search Loading Indicator */}
            {isSearching && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          {/* Category Tabs */}
          {!searchQuery.trim() && (
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
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
          !loading && !isSearching && (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg mb-4">No movies found</p>
              {searchQuery.trim() && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    handleCategoryChange('trending');
                  }}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Clear Search
                </button>
              )}
            </div>
          )
        )}
        
        {/* Loading state when searching */}
        {isSearching && (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        )}
      </div>
    </div>
  );
};

export default Movies;