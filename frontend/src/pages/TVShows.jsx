import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import MovieRow from '../components/MovieRow';
import LoadingSpinner from '../components/LoadingSpinner'; 
import ErrorMessage from '../components/ErrorMessage';
import { 
  fetchTrendingTV,
  fetchPopularTV,
  fetchTopRatedTV,
  fetchAiringTodayTV,
  fetchOnTheAirTV,
  fetchTVSearch
} from '../features/tv/tvSlice';
import { Search, Tv } from 'lucide-react';

const TVShows = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); 
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('trending');
  const [isSearching, setIsSearching] = useState(false);
  
  const tvState = useSelector((state) => state.tv || {});
  const { 
    trending = [], 
    popular = [],
    topRated = [],
    airingToday = [],
    onTheAir = [],
    searchResults = [], 
    loading = false, 
    error = null 
  } = tvState;

  // Update active category based on URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    const search = params.get('search');
    
    if (search) {
      setSearchQuery(search);
      setActiveCategory('search');
    } else if (category && ['trending', 'popular', 'topRated', 'airingToday', 'onTheAir'].includes(category)) {
      setActiveCategory(category);
    } else {
      setActiveCategory('trending');
      // Update URL if needed
      if (!category && !search) {
        navigate('/tv?category=trending', { replace: true });
      }
    }
  }, [location.search, navigate]);

  // Fetch all categories
  useEffect(() => {
    dispatch(fetchTrendingTV());
    dispatch(fetchPopularTV());
    dispatch(fetchTopRatedTV());
    dispatch(fetchAiringTodayTV());
    dispatch(fetchOnTheAirTV());
  }, [dispatch]);

  // Handle search
  useEffect(() => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      const timer = setTimeout(async () => {
        try {
          await dispatch(fetchTVSearch(searchQuery));
          setActiveCategory('search');
          navigate(`/tv?search=${encodeURIComponent(searchQuery)}`, { replace: true });
        } finally {
          setIsSearching(false);
        }
      }, 500);
      return () => {
        clearTimeout(timer);
        setIsSearching(false);
      };
    }
  }, [searchQuery, dispatch, navigate]);

  const handleTVShowClick = (show) => {
    navigate(`/tv/${show.id}`);
  };

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    setSearchQuery(''); 
    navigate(`/tv?category=${categoryId}`);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    handleCategoryChange('trending');
  };

  const categories = [
    { id: 'trending', title: 'Trending TV Shows', shows: trending, count: trending.length },
    { id: 'popular', title: 'Popular TV Shows', shows: popular, count: popular.length },
    { id: 'topRated', title: 'Top Rated TV Shows', shows: topRated, count: topRated.length },
    { id: 'airingToday', title: 'Airing Today', shows: airingToday, count: airingToday.length },
    { id: 'onTheAir', title: 'On The Air', shows: onTheAir, count: onTheAir.length },
  ];

  const displayShows = activeCategory === 'search' ? searchResults : 
    categories.find(c => c.id === activeCategory)?.shows || [];

  const getCategoryTitle = () => {
    if (activeCategory === 'search') {
      return `Search Results for "${searchQuery}"`;
    }
    const category = categories.find(c => c.id === activeCategory);
    return category?.title || 'TV Shows';
  };

  // Show loading spinner while loading and no data
  if (loading && !trending.length && !popular.length && !searchResults.length && !isSearching) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="pt-32 flex justify-center">
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
          <Tv className="w-8 h-8 text-red-600 mr-3" />
          <h1 className="text-3xl sm:text-4xl font-bold text-white">
            {getCategoryTitle()}
          </h1>
        </div>

        {/* Search Bar with Loading Indicator */}
        <div className="relative max-w-md mb-6">
          <input
            type="text"
            placeholder="Search TV shows..."
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
                className={`px-4 py-2 rounded-lg transition ${
                  activeCategory === category.id
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {category.title} ({category.count})
              </button>
            ))}
          </div>
        )}

        {/* Results count */}
        {displayShows.length > 0 && (
          <p className="text-sm text-gray-400 mb-4">
            Showing {displayShows.length} TV shows
          </p>
        )}

        {error && <ErrorMessage message={error} />}

        {/* Loading state */}
        {isSearching && (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        )}

        {/* Show content */}
        {!isSearching && (
          loading && displayShows.length === 0 ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : displayShows.length > 0 ? (
            <MovieRow
              title=""
              movies={displayShows.map(show => ({
                id: show.id,
                title: show.name,
                poster_path: show.poster_path,
                vote_average: show.vote_average,
                release_date: show.first_air_date
              }))}
              onMovieClick={handleTVShowClick}
            />
          ) : (
            !loading && (
              <div className="text-center py-16">
                <p className="text-gray-400 text-lg">No TV shows found</p>
                {searchQuery.trim() && (
                  <button
                    onClick={handleClearSearch}
                    className="mt-4 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            )
          )
        )}
      </div>
    </div>
  );
};

export default TVShows;