import { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import HeroBanner from '../components/HeroBanner';
import AISuggestions from '../components/AISuggestions';
import MovieRow from '../components/MovieRow';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { 
  fetchTrending as fetchTrendingMovies, 
  fetchPopular as fetchPopularMovies,
  fetchTopRated as fetchTopRatedMovies,
  fetchNowPlaying,
  fetchUpcoming
} from '../features/movie/movieSlice';
import {
  fetchTrendingTV,
  fetchPopularTV,
  fetchTopRatedTV,
  fetchAiringTodayTV,
  fetchOnTheAirTV
} from '../features/tv/tvSlice';
import { fetchWatchlist } from '../features/user/userSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Safely access state with defaults
  const movieState = useSelector((state) => state.movie || {});
  const tvState = useSelector((state) => state.tv || {});
  const userState = useSelector((state) => state.user || {});
  
  // Movie data
  const { 
    trending: trendingMovies = [], 
    popular: popularMovies = [],
    topRated: topRatedMovies = [],
    nowPlaying = [],
    upcoming = [],
    loading: moviesLoading = false, 
    error: moviesError = null 
  } = movieState;
  
  // TV data
  const {
    trending: trendingTV = [],
    popular: popularTV = [],
    topRated: topRatedTV = [],
    airingToday = [],
    onTheAir = [],
    loading: tvLoading = false,
    error: tvError = null
  } = tvState;
  
  const { watchlist = [] } = userState;
  
  const [featuredItems, setFeaturedItems] = useState([]);

  // Fetch all data on component mount
  useEffect(() => {
    // Fetch all movie categories
    dispatch(fetchTrendingMovies());
    dispatch(fetchPopularMovies());
    dispatch(fetchTopRatedMovies());
    dispatch(fetchNowPlaying());
    dispatch(fetchUpcoming());
    
    // Fetch all TV categories
    dispatch(fetchTrendingTV());
    dispatch(fetchPopularTV());
    dispatch(fetchTopRatedTV());
    dispatch(fetchAiringTodayTV());
    dispatch(fetchOnTheAirTV());
    
    // Fetch user's watchlist
    dispatch(fetchWatchlist());
  }, [dispatch]);

  // Create featured items using useMemo instead of useEffect with setState
  const calculatedFeaturedItems = useMemo(() => {
    const items = [
      // Add trending movies (top 5) with type
      ...(trendingMovies?.slice(0, 5).map(movie => ({ 
        ...movie, 
        type: 'movie',
        title: movie.title,
        release_date: movie.release_date
      })) || []),
      
      // Add trending TV shows (top 3) with type
      ...(trendingTV?.slice(0, 3).map(show => ({ 
        ...show, 
        type: 'tv',
        title: show.name,
        release_date: show.first_air_date
      })) || [])
    ];
    
    // If no trending items, use popular as fallback
    if (items.length === 0) {
      return [
        ...(popularMovies?.slice(0, 3).map(movie => ({ ...movie, type: 'movie' })) || []),
        ...(popularTV?.slice(0, 2).map(show => ({ ...show, type: 'tv', title: show.name })) || [])
      ];
    }
    
    return items;
  }, [trendingMovies, trendingTV, popularMovies, popularTV]);

  // Update featuredItems when calculated items change
  useEffect(() => {
    setFeaturedItems(calculatedFeaturedItems);
  }, [calculatedFeaturedItems]);

  const handleContentClick = useCallback((item, type) => {
    if (type === 'tv') {
      navigate(`/tv/${item.id}`);
    } else {
      navigate(`/movie/${item.id}`);
    }
  }, [navigate]);

  // Show loading only if no data at all
  if ((moviesLoading || tvLoading) && !trendingMovies.length && !trendingTV.length) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

 
  const error = moviesError || tvError;

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      {/* Hero Banner with multiple items */}
      {featuredItems.length > 0 && (
        <HeroBanner items={featuredItems} />
      )}

      {/* Main Content */}
      <div className="relative z-10 -mt-32">
        {/* AI Suggestions Section */}
        <AISuggestions />

        {/* Error Display */}
        {error && <ErrorMessage message={error} />}

        {/* Content Rows */}
        <div className="space-y-8 pb-16">
          {/* Trending Movies */}
          {trendingMovies && trendingMovies.length > 0 && (
            <MovieRow
              title="Trending Movies"
              movies={trendingMovies}
              onMovieClick={(movie) => handleContentClick(movie, 'movie')}
            />
          )}

          {/* Trending TV Shows */}
          {trendingTV && trendingTV.length > 0 && (
            <MovieRow
              title="Trending TV Shows"
              movies={trendingTV.map(show => ({
                id: show.id,
                title: show.name,
                poster_path: show.poster_path,
                vote_average: show.vote_average,
                release_date: show.first_air_date
              }))}
              onMovieClick={(show) => handleContentClick(show, 'tv')}
            />
          )}

          {/* Popular Movies */}
          {popularMovies && popularMovies.length > 0 && (
            <MovieRow
              title="Popular Movies"
              movies={popularMovies}
              onMovieClick={(movie) => handleContentClick(movie, 'movie')}
            />
          )}

          {/* Popular TV Shows */}
          {popularTV && popularTV.length > 0 && (
            <MovieRow
              title="Popular TV Shows"
              movies={popularTV.map(show => ({
                id: show.id,
                title: show.name,
                poster_path: show.poster_path,
                vote_average: show.vote_average,
                release_date: show.first_air_date
              }))}
              onMovieClick={(show) => handleContentClick(show, 'tv')}
            />
          )}

          {/* Top Rated Movies */}
          {topRatedMovies && topRatedMovies.length > 0 && (
            <MovieRow
              title="Top Rated Movies"
              movies={topRatedMovies}
              onMovieClick={(movie) => handleContentClick(movie, 'movie')}
            />
          )}

          {/* Top Rated TV Shows */}
          {topRatedTV && topRatedTV.length > 0 && (
            <MovieRow
              title="Top Rated TV Shows"
              movies={topRatedTV.map(show => ({
                id: show.id,
                title: show.name,
                poster_path: show.poster_path,
                vote_average: show.vote_average,
                release_date: show.first_air_date
              }))}
              onMovieClick={(show) => handleContentClick(show, 'tv')}
            />
          )}

          {/* Now Playing Movies */}
          {nowPlaying && nowPlaying.length > 0 && (
            <MovieRow
              title="Now Playing"
              movies={nowPlaying}
              onMovieClick={(movie) => handleContentClick(movie, 'movie')}
            />
          )}

          {/* Airing Today TV Shows */}
          {airingToday && airingToday.length > 0 && (
            <MovieRow
              title="Airing Today"
              movies={airingToday.map(show => ({
                id: show.id,
                title: show.name,
                poster_path: show.poster_path,
                vote_average: show.vote_average,
                release_date: show.first_air_date
              }))}
              onMovieClick={(show) => handleContentClick(show, 'tv')}
            />
          )}

          {/* Upcoming Movies */}
          {upcoming && upcoming.length > 0 && (
            <MovieRow
              title="Upcoming Releases"
              movies={upcoming}
              onMovieClick={(movie) => handleContentClick(movie, 'movie')}
            />
          )}

          {/* On The Air TV Shows */}
          {onTheAir && onTheAir.length > 0 && (
            <MovieRow
              title="On The Air"
              movies={onTheAir.map(show => ({
                id: show.id,
                title: show.name,
                poster_path: show.poster_path,
                vote_average: show.vote_average,
                release_date: show.first_air_date
              }))}
              onMovieClick={(show) => handleContentClick(show, 'tv')}
            />
          )}

          {/* Recommended for You - Mix of top rated movies and TV */}
          {(topRatedMovies.length > 0 || topRatedTV.length > 0) && (
            <MovieRow
              title="Recommended for You"
              movies={[
                ...topRatedMovies.slice(0, 10).map(m => ({ ...m, type: 'movie' })),
                ...topRatedTV.slice(0, 10).map(t => ({ 
                  id: t.id,
                  title: t.name,
                  poster_path: t.poster_path,
                  vote_average: t.vote_average,
                  release_date: t.first_air_date,
                  type: 'tv'
                }))
              ]}
              onMovieClick={(item) => handleContentClick(item, item.type || 'movie')}
            />
          )}

          {/* User's Watchlist */}
          {watchlist && watchlist.length > 0 && (
            <MovieRow
              title="Your Watchlist"
              movies={watchlist.map(item => ({
                id: item.tmdbId,
                title: item.title,
                poster_path: item.poster,
                vote_average: item.voteAverage,
                release_date: item.release_date,
                type: item.media_type || 'movie'
              }))}
              onMovieClick={(item) => navigate(item.type === 'tv' ? `/tv/${item.id}` : `/movie/${item.id}`)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;