// MovieDetail.jsx - Fully optimized

import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import YouTube from 'react-youtube';
import { fetchMovieDetails, fetchOmdbRatings, fetchAISummary } from '../features/movie/movieSlice';
import { fetchSummary } from '../features/ai/aiSlice';
import { addWatchlist, addHistory } from '../features/user/userSlice';
import { 
  fetchItemRating, 
  fetchAverageRating
} from '../features/rating/ratingSlice';
import { fetchMovieSources } from '../features/movie/movieSlice';
import { playVideo } from '../features/moviebox/movieboxSlice';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import RatingModal from '../components/RatingModal';
import RatingDisplay from '../components/RatingDisplay';
import { getStreamUrl, getDownloadUrl, formatFileSize } from '../services/movieboxService';
import { Heart, Star, Clock, Calendar, Film, Play, Sparkles, Volume2, VolumeX, Download } from 'lucide-react'; 

const MovieDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  
  // Critical state - shows immediately
  const [showPage, setShowPage] = useState(false);
  const [showAISummary, setShowAISummary] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showSources, setShowSources] = useState(false);
  const [sources, setSources] = useState([]);
  const [loadingSources, setLoadingSources] = useState(false);
  
  // Trailer state
  const [trailerKey, setTrailerKey] = useState('');
  const [isMuted, setIsMuted] = useState(true);
  const [showTrailerInHero, setShowTrailerInHero] = useState(false);
  const [trailerError, setTrailerError] = useState(false);
  
  // UI state
  const [isMobile, setIsMobile] = useState(false);
  const [castLoaded, setCastLoaded] = useState(false);
  const playerRef = useRef(null);
  
  // Redux state
  const { details, loading, error, omdbRatings } = useSelector((state) => state.movie);
  const { summary, loading: aiLoading } = useSelector((state) => state.ai);
  const { itemRatings, averageRatings } = useSelector((state) => state.rating);

  // ============= PRIORITY 1: Load movie details FAST =============
  useEffect(() => {
    const loadCriticalData = async () => {
      try {
        // Only fetch movie details first - FAST now!
        const result = await dispatch(fetchMovieDetails(id)).unwrap();
        setShowPage(true); // Show page immediately
        
        // Then load secondary data in background
        loadSecondaryData(result);
        
      } catch (error) {
        console.error('Failed to load movie:', error);
        setShowPage(true); // Still show page even if error
      }
    };
    
    loadCriticalData();
  }, [dispatch, id]);

  // ============= PRIORITY 2: Load secondary data in background =============
  const loadSecondaryData = useCallback(async (movieData) => {
    // Load ratings in background
    Promise.all([
      dispatch(fetchItemRating(id)),
      dispatch(fetchAverageRating(id))
    ]).catch(err => console.log('Rating load failed:', err));

    // Add to history in background
    if (movieData?.id) {
      dispatch(addHistory({
        tmdbId: movieData.id,
        title: movieData.title,
        poster: movieData.poster_path
      })).catch(err => console.log('History add failed:', err));
    }

    // Load OMDB ratings if IMDB ID exists
    if (movieData?.imdb_id) {
      dispatch(fetchOmdbRatings(movieData.imdb_id))
        .catch(err => console.log('OMDB ratings load failed:', err));
    }
  }, [dispatch, id]);

  // ============= PRIORITY 3: Load cast lazily =============
  useEffect(() => {
    if (!showPage) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setCastLoaded(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const castSection = document.getElementById('cast-section');
    if (castSection) {
      observer.observe(castSection);
    }

    return () => observer.disconnect();
  }, [showPage]);

  // ============= Extract trailer key =============
  useEffect(() => {
    if (details?.videos?.results) {
      const trailer = details.videos.results.find(
        video => video.type === 'Trailer' && video.site === 'YouTube'
      );
      const teaser = !trailer ? details.videos.results.find(
        video => video.type === 'Teaser' && video.site === 'YouTube'
      ) : null;
      
      const video = trailer || teaser;
      if (video?.key) {
        setTrailerKey(video.key);
        setShowTrailerInHero(true);
      }
    }
  }, [details]);

  // ============= OPTIMIZED: Load sources only when user clicks =============
  const handleGetSources = async () => {
    setShowSources(!showSources);
    
    if (!showSources && (!sources || sources.length === 0)) {
      setLoadingSources(true);
      
      try {
        const result = await dispatch(fetchMovieSources(id)).unwrap();
        if (result?.sources) {
          setSources(result.sources);
        } else {
          setSources([]);
        }
      } catch (error) {
        console.error('Error fetching sources:', error);
        setSources([]);
      } finally {
        setLoadingSources(false);
      }
    }
  };

  // ============= OPTIMIZED: Load AI summary only when user clicks =============
  const handleAISummary = useCallback(() => {
    if (!showAISummary && details?.overview) {
      dispatch(fetchAISummary(details.overview));
    }
    setShowAISummary(!showAISummary);
  }, [dispatch, details, showAISummary]);

  // ============= Mobile detection =============
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // YouTube player options
  const opts = useMemo(() => ({
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: isMobile ? 0 : 1,
      mute: isMobile ? 0 : 1,
      controls: isMobile ? 1 : 0,
      showinfo: 0,
      rel: 0,
      loop: 1,
      playlist: trailerKey,
      modestbranding: 1,
      iv_load_policy: 3,
      disablekb: 1,
      fs: 0,
    },
  }), [trailerKey, isMobile]);

  const onPlayerReady = (event) => {
    playerRef.current = event.target;
    if (!isMobile) {
      event.target.mute();
      event.target.playVideo();
    }
  };

  const toggleMute = useCallback(() => {
    if (playerRef.current) {
      if (isMuted) {
        playerRef.current.unMute();
      } else {
        playerRef.current.mute();
      }
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

  const onPlayerError = () => {
    setTrailerError(true);
  };

  const handleAddToWatchlist = useCallback(() => {
    if (!details) return;
    dispatch(addWatchlist({
      tmdbId: details.id,
      omdbId: details.imdb_id,
      title: details.title,
      poster: details.poster_path,
      voteAverage: details.vote_average,
      media_type: 'movie',
      release_date: details.release_date
    }));
  }, [dispatch, details]);

  const handlePlayVideo = (source) => {
    const streamUrl = getStreamUrl(source.url);
    dispatch(playVideo({
      url: streamUrl,
      title: details.title,
      quality: source.quality
    }));
  };

  const handleDownload = (url, quality) => {
    const downloadUrl = getDownloadUrl(url, details.title, quality);
    const filename = `${details.title.replace(/[^a-z0-9]/gi, "_")}_${quality}.mp4`;

    if (isMobile) {
      window.open(downloadUrl, "_blank");
    } else {
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleRatingSubmit = async ({ rating, review }) => {
    console.log('Rating submitted:', rating, review);
    setShowRatingModal(false);
  };

  const handleRemoveRating = async () => {
    if (window.confirm('Remove your rating?')) {
      console.log('Rating removed');
    }
  };

  const currentRating = itemRatings?.[id];

  // Show skeleton loader immediately
  if (!showPage || (loading && !details)) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="pt-24 px-4 max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-[50vh] md:h-[70vh] bg-gray-800 rounded-lg mb-8"></div>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/3 lg:w-1/4">
                <div className="w-full h-[450px] bg-gray-800 rounded-2xl"></div>
              </div>
              <div className="md:w-2/3 lg:w-3/4">
                <div className="h-12 bg-gray-800 rounded w-3/4 mb-4"></div>
                <div className="h-6 bg-gray-800 rounded w-1/2 mb-6"></div>
                <div className="h-24 bg-gray-800 rounded mb-6"></div>
                <div className="flex gap-4">
                  <div className="h-12 bg-gray-800 rounded w-32"></div>
                  <div className="h-12 bg-gray-800 rounded w-32"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !details) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="pt-24 px-4">
          <ErrorMessage message={error || 'Movie not found'} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pb-7">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative h-[50vh] md:h-[70vh] w-full overflow-hidden">
        {showTrailerInHero && trailerKey && !trailerError ? (
          <>
            <div className="absolute inset-0">
              <YouTube
                videoId={trailerKey}
                opts={opts}
                onReady={onPlayerReady}
                onError={onPlayerError}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[calc(100%+100px)] h-[calc(100%+100px)]"
                style={{ pointerEvents: 'none' }}
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            
            {!isMobile && (
              <button
                onClick={toggleMute}
                className="absolute bottom-24 right-8 z-20 bg-black/50 p-3 rounded-full hover:bg-black/70 transition"
              >
                {isMuted ? <VolumeX className="w-6 h-6 text-white" /> : <Volume2 className="w-6 h-6 text-white" />}
              </button>
            )}
          </>
        ) : (
          <>
            <img
              src={`https://image.tmdb.org/t/p/original${details.backdrop_path}`}
              alt={details.title}
              className="w-full h-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          </>
        )}
      </div>

      {/* Movie Details */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 md:-mt-48">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="md:w-1/3 lg:w-1/4">
            <img
              src={`https://image.tmdb.org/t/p/w500${details.poster_path}`}
              alt={details.title}
              className="w-full rounded-2xl shadow-2xl"
              loading="eager"
            />
          </div>

          {/* Info */}
          <div className="md:w-2/3 lg:w-3/4 text-white">
            <h1 className="text-3xl md:text-5xl font-bold mb-2">{details.title}</h1>
            
            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center">
                <Star className="w-5 h-5 text-yellow-400 mr-1" />
                <span>{details.vote_average?.toFixed(1)}</span>
              </div>
              <span>•</span>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                <span>{new Date(details.release_date).getFullYear()}</span>
              </div>
              <span>•</span>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>{details.runtime} min</span>
              </div>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-6">
              {details.genres?.map(genre => (
                <span key={genre.id} className="px-3 py-1 bg-gray-800 rounded-full text-sm">
                  {genre.name}
                </span>
              ))}
            </div>

            {/* Rating Display - Shows skeleton until ratings load */}
            {itemRatings ? (
              <div className="mb-6">
                <RatingDisplay
                  userRating={currentRating?.userRating}
                  averageRating={averageRatings?.[id]?.average}
                  totalRatings={averageRatings?.[id]?.total}
                  onRateClick={() => setShowRatingModal(true)}
                  isRated={!!currentRating?.userRating}
                />
              </div>
            ) : (
              <div className="h-16 bg-gray-800 rounded animate-pulse mb-6"></div>
            )}

            {/* Overview */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-2">Overview</h2>
              <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                {details.overview}
              </p>
            </div>

            {/* Cast - Load lazily */}
            <div id="cast-section">
              {castLoaded && details.credits?.cast?.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">Cast</h2>
                  <div className="flex flex-wrap gap-4">
                    {details.credits.cast.slice(0, isMobile ? 3 : 5).map(actor => (
                      <div key={actor.id} className="text-center">
                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gray-700 overflow-hidden mb-2">
                          {actor.profile_path ? (
                            <img
                              src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                              alt={actor.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Film className="w-6 h-6 text-gray-500" />
                            </div>
                          )}
                        </div>
                        <p className="text-xs md:text-sm font-medium">{actor.name}</p>
                        <p className="text-xs text-gray-400">{actor.character}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* OMDB Ratings - Show if available */}
            {omdbRatings && Object.keys(omdbRatings).length > 0 && (
              <div className="mb-4 p-3 bg-gray-800/50 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-400 mb-2">Additional Ratings</h3>
                <div className="flex flex-wrap gap-3">
                  {omdbRatings.imdbRating && (
                    <div className="text-xs">
                      <span className="text-yellow-400">IMDb:</span> {omdbRatings.imdbRating}
                    </div>
                  )}
                  {omdbRatings.metascore && (
                    <div className="text-xs">
                      <span className="text-green-400">Metacritic:</span> {omdbRatings.metascore}
                    </div>
                  )}
                  {omdbRatings.rottenTomatoes && (
                    <div className="text-xs">
                      <span className="text-red-400">Rotten Tomatoes:</span> {omdbRatings.rottenTomatoes}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddToWatchlist}
                className="flex items-center justify-center px-6 py-3 bg-red-600 rounded-lg hover:bg-red-700 transition"
              >
                <Heart className="w-5 h-5 mr-2" />
                Add to Watchlist
              </button>
              
              <button
                onClick={handleAISummary}
                className="flex items-center justify-center px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-700 transition"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                {showAISummary ? 'Hide AI Summary' : 'AI Summary'}
              </button>

              <button
                onClick={handleGetSources}
                className="flex items-center justify-center px-6 py-3 bg-green-600 rounded-lg hover:bg-green-700 transition"
                disabled={loadingSources}
              >
                <Play className="w-5 h-5 mr-2" />
                {loadingSources ? 'Loading...' : (showSources ? 'Hide Sources' : 'Watch Now')}
              </button>
            </div>

            {/* AI Summary Display */}
            {showAISummary && (
              <div className="mt-6 p-4 bg-purple-600/20 border border-purple-600 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-400 mb-2 flex items-center">
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI Summary
                </h3>
                {aiLoading ? (
                  <div className="h-16 bg-purple-600/20 rounded animate-pulse"></div>
                ) : (
                  <p className="text-gray-300 text-sm md:text-base">
                    {summary || 'No summary available.'}
                  </p>
                )}
              </div>
            )}

            {/* Sources Display */}
            {showSources && (
              <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <Play className="w-5 h-5 mr-2 text-green-500" />
                  Available Qualities
                </h3>
                
                {loadingSources ? (
                  <div className="flex justify-center py-4">
                    <LoadingSpinner />
                  </div>
                ) : sources.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {sources.map((source) => (
                      <div key={source.quality} className="bg-gray-900 rounded-lg p-3 border border-gray-700">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-green-500 font-bold">{source.quality}</span>
                          <span className="text-xs text-gray-400">{formatFileSize(source.size)}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <button
                            onClick={() => handlePlayVideo(source)}
                            className="flex-1 px-3 py-2 bg-green-600 rounded hover:bg-green-700 text-sm"
                          >
                            <Play className="w-4 h-4 inline mr-1" /> Play
                          </button>
                          
                          <button
                            onClick={() => handleDownload(source.url, source.quality)}
                            className="flex-1 px-3 py-2 bg-blue-600 rounded hover:bg-blue-700 text-sm"
                          >
                            <Download className="w-4 h-4 inline mr-1" /> Download
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-4">No streaming sources available</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Rating Modal */}
      <RatingModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        onSubmit={handleRatingSubmit}
        itemTitle={details.title}
        currentRating={currentRating?.userRating}
        currentReview={currentRating?.review}
      />
    </div>
  );
};

export default MovieDetail;