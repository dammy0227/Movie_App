// TVDetail.jsx - Optimized with Netflix-style instant trailer

import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import YouTube from 'react-youtube';
import { fetchTVDetails } from '../features/tv/tvSlice';
import { fetchSummary } from '../features/ai/aiSlice';
import { addWatchlist } from '../features/user/userSlice';
import { 
  fetchItemRating, 
  fetchAverageRating
} from '../features/rating/ratingSlice';
import { fetchTVEpisodeSources } from '../features/tv/tvSlice';
import { playVideo } from '../features/moviebox/movieboxSlice';
import { getStreamUrl, getDownloadUrl, formatFileSize } from '../services/movieboxService';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import RatingModal from '../components/RatingModal';
import RatingDisplay from '../components/RatingDisplay';
import { Heart, Star, Calendar, Film, Play, Sparkles, Volume2, VolumeX, Download, ChevronDown } from 'lucide-react';

const TVDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  
  // Critical state - shows immediately
  const [showPage, setShowPage] = useState(false);
  const [showAISummary, setShowAISummary] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  
  // Episode selection state
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [showEpisodeSelector, setShowEpisodeSelector] = useState(false);
  const [showSources, setShowSources] = useState(false);
  const [sources, setSources] = useState([]);
  const [loadingSources, setLoadingSources] = useState(false);
  
  // Season details state
  const [seasonDetails, setSeasonDetails] = useState(null);
  const [loadingSeason, setLoadingSeason] = useState(false);
  
  // Trailer state
  const [trailerKey, setTrailerKey] = useState('');
  const [isMuted, setIsMuted] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerError, setTrailerError] = useState(false);
  const [trailerLoaded, setTrailerLoaded] = useState(false);
  
  // UI state
  const [isMobile, setIsMobile] = useState(false);
  const [castLoaded, setCastLoaded] = useState(false);
  const playerRef = useRef(null);

  // Redux state
  const { details, loading, error } = useSelector((state) => state.tv || {});
  const { summary, loading: aiLoading } = useSelector((state) => state.ai || {});
  const { itemRatings, averageRatings } = useSelector((state) => state.rating || {});

  // ============= PRIORITY 1: Load TV details FAST =============
  useEffect(() => {
    const loadCriticalData = async () => {
      try {
        // Only fetch TV details first - most important
        await dispatch(fetchTVDetails(id)).unwrap();
        setShowPage(true); // Show page immediately after details load
        
        // Then load secondary data in background
        loadSecondaryData();
      } catch (error) {
        console.error('Failed to load TV show:', error);
        setShowPage(true); // Still show page even if error
      }
    };
    
    loadCriticalData();
  }, [dispatch, id]);

  // ============= PRIORITY 2: Load secondary data in background =============
  const loadSecondaryData = useCallback(async () => {
    // Load ratings in background (don't await)
    Promise.all([
      dispatch(fetchItemRating(id)),
      dispatch(fetchAverageRating(id))
    ]).catch(err => console.log('Rating load failed:', err));

    // Set default season to first season
    if (details?.number_of_seasons) {
      setSelectedSeason(1);
    }
  }, [dispatch, id, details]);

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

  // ============= Fetch season details (only when needed) =============
  useEffect(() => {
    const fetchSeasonDetails = async () => {
      if (!details?.id || !showEpisodeSelector) return; // Only fetch when selector is open
      
      setLoadingSeason(true);
      try {
        const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
        
        if (!API_KEY) {
          console.error('TMDB API key is missing');
          return;
        }
        
        const response = await fetch(
          `https://api.themoviedb.org/3/tv/${details.id}/season/${selectedSeason}?api_key=${API_KEY}`
        );
        
        if (!response.ok) {
          throw new Error(`Failed to fetch season details: ${response.status}`);
        }
        
        const data = await response.json();
        setSeasonDetails(data);
        
        // Reset selected episode to 1 when season changes
        setSelectedEpisode(1);
      } catch (error) {
        console.error('Error fetching season details:', error);
      } finally {
        setLoadingSeason(false);
      }
    };

    fetchSeasonDetails();
  }, [details?.id, selectedSeason, showEpisodeSelector]);

  // ============= Extract trailer key =============
  useEffect(() => {
    if (details?.videos?.results) {
      const trailer = details.videos.results.find(
        video => video.type === 'Trailer' && video.site === 'YouTube'
      );
      if (trailer?.key) {
        setTrailerKey(trailer.key);
        setShowTrailer(true); // Show trailer immediately on all devices
        
        // Preload the YouTube iframe API
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(tag);
      }
    }
  }, [details]);

  // ============= Pre-fetch episode sources in background =============
  useEffect(() => {
    // Pre-fetch sources for first episode in background
    if (details?.id) {
      dispatch(fetchTVEpisodeSources({
        tvId: id,
        season: 1,
        episode: 1
      })).then((result) => {
        if (result.payload?.sources) {
          console.log('✅ Pre-fetched episode sources in background');
        }
      }).catch(err => console.log('Background pre-fetch failed'));
    }
  }, [details?.id, id, dispatch]);

  // YouTube player options - Netflix style
  const opts = useMemo(() => ({
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 1, // Always autoplay
      mute: 1, // Start muted (Netflix style)
      controls: 0, // Hide controls
      showinfo: 0,
      rel: 0,
      loop: 1,
      playlist: trailerKey,
      modestbranding: 1,
      iv_load_policy: 3,
      disablekb: 1,
      fs: 0,
      origin: window.location.origin,
      enablejsapi: 1,
      widget_referrer: window.location.origin,
      playsinline: 1 // Important for mobile
    },
  }), [trailerKey]);

  const onPlayerReady = (event) => {
    playerRef.current = event.target;
    setTrailerLoaded(true);
    
    // Start playing immediately
    event.target.playVideo();
  };

  const onPlayerStateChange = (event) => {
    // When video ends, restart
    if (event.data === 0) {
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

  const onPlayerError = (error) => {
    console.log('YouTube error:', error);
    setTrailerError(true);
  };

  // Season options
  const seasonOptions = useMemo(() => 
    details?.number_of_seasons 
      ? Array.from({ length: details.number_of_seasons }, (_, i) => i + 1)
      : [1],
    [details?.number_of_seasons]
  );

  // Episode options
  const episodeOptions = useMemo(() => {
    if (seasonDetails?.episodes && seasonDetails.episodes.length > 0) {
      return seasonDetails.episodes.map(ep => ep.episode_number);
    }
    return [];
  }, [seasonDetails]);

  const handleAddToWatchlist = useCallback(() => {
    if (!details) return;
    dispatch(addWatchlist({
      tmdbId: details.id,
      title: details.name,
      poster: details.poster_path,
      voteAverage: details.vote_average,
      media_type: 'tv',
      release_date: details.first_air_date
    }));
  }, [dispatch, details]);

  const handleAISummary = useCallback(() => {
    if (!details) return;
    if (!showAISummary && details?.overview) {
      dispatch(fetchSummary({ plot: details.overview }));
    }
    setShowAISummary(!showAISummary);
  }, [dispatch, details, showAISummary]);

  const handleGetEpisodeSources = async () => {
    setShowSources(!showSources);
    if (!showSources) {
      setLoadingSources(true);
      
      try {
        const result = await dispatch(fetchTVEpisodeSources({
          tvId: id,
          season: selectedSeason,
          episode: selectedEpisode
        })).unwrap();
        
        if (result?.sources) {
          setSources(result.sources);
        } else {
          setSources([]);
        }
      } catch (error) {
        console.error('Error fetching episode sources:', error);
        setSources([]);
      } finally {
        setLoadingSources(false);
      }
    }
  };

  const handlePlayVideo = (source) => {
    const streamUrl = getStreamUrl(source.url);
    dispatch(playVideo({
      url: streamUrl,
      title: `${details.name} S${selectedSeason}E${selectedEpisode}`,
      quality: source.quality
    }));
  };

  const handleDownload = (url, quality) => {
    const episodeTitle = `${details.name} S${selectedSeason}E${selectedEpisode}`;
    const downloadUrl = getDownloadUrl(url, episodeTitle, quality);
    const filename = `${details.name.replace(/[^a-z0-9]/gi, '_')}_S${selectedSeason}E${selectedEpisode}_${quality}.mp4`;

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

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const currentRating = itemRatings?.[id];

  // Skeleton loader
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
          <ErrorMessage message={error || 'TV show not found'} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      {/* Hero Section - Netflix style with instant trailer on all devices */}
      <div className="relative h-[50vh] md:h-[70vh] w-full overflow-hidden bg-black">
        {showTrailer && trailerKey && !trailerError ? (
          <>
            {/* Trailer Background */}
            <div className="absolute inset-0">
              <YouTube
                videoId={trailerKey}
                opts={opts}
                onReady={onPlayerReady}
                onStateChange={onPlayerStateChange}
                onError={onPlayerError}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full"
                style={{ 
                  pointerEvents: 'none',
                  objectFit: 'cover'
                }}
              />
            </div>
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            
            {/* Netflix-style Title Overlay */}
            <div className="absolute bottom-24 left-8 md:left-16 z-10 text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">{details.name}</h1>
              <div className="flex items-center gap-4 text-sm md:text-base">
                <span className="text-green-500 font-semibold">Now Playing</span>
                <span>•</span>
                <span>{details.first_air_date?.slice(0, 4) || 'N/A'}</span>
                <span>•</span>
                <span>{details.number_of_seasons} Season{details.number_of_seasons !== 1 ? 's' : ''}</span>
              </div>
            </div>
            
            {/* Sound Toggle Button - Always visible */}
            <button
              onClick={toggleMute}
              className="absolute bottom-24 right-8 z-20 bg-black/50 p-3 rounded-full hover:bg-black/70 transition"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="w-6 h-6 text-white" /> : <Volume2 className="w-6 h-6 text-white" />}
            </button>

            {/* Loading Indicator */}
            {!trailerLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <LoadingSpinner />
              </div>
            )}
          </>
        ) : (
          <>
            <img
              src={details.backdrop_path 
                ? `https://image.tmdb.org/t/p/original${details.backdrop_path}`
                : 'https://via.placeholder.com/1920x1080?text=No+Backdrop'
              }
              alt={details.name}
              className="w-full h-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            
            {/* Play button overlay if trailer failed */}
            {trailerKey && trailerError && (
              <div className="absolute inset-0 flex items-center justify-center">
                <button 
                  onClick={() => setTrailerError(false)}
                  className="bg-red-600 rounded-full p-4 hover:bg-red-700 transition"
                >
                  <Play className="w-12 h-12 text-white" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* TV Show Details */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 -mt-24 md:-mt-48 pb-16">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="md:w-1/3 lg:w-1/4">
            <img
              src={details.poster_path 
                ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
                : 'https://via.placeholder.com/500x750?text=No+Poster'
              }
              alt={details.name}
              className="w-full rounded-2xl shadow-2xl"
              loading="eager"
            />
          </div>

          <div className="md:w-2/3 text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{details.name}</h1>
            
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center">
                <Star className="w-5 h-5 text-yellow-400 mr-1" />
                <span>{details.vote_average?.toFixed(1) || 'N/A'}</span>
              </div>
              <span>•</span>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                <span>{details.first_air_date?.slice(0, 4) || 'N/A'}</span>
              </div>
              <span>•</span>
              <span>{details.number_of_seasons || 0} Seasons</span>
              <span>•</span>
              <span>{details.number_of_episodes || 0} Episodes</span>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {details.genres?.map(genre => (
                <span key={genre.id} className="px-3 py-1 bg-gray-800 rounded-full text-sm">
                  {genre.name}
                </span>
              ))}
            </div>

            {/* Rating Display with skeleton */}
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

            <p className="text-gray-300 leading-relaxed text-sm md:text-base mb-8">
              {details.overview || 'No overview available.'}
            </p>

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
                AI Summary
              </button>

              <button
                onClick={() => setShowEpisodeSelector(!showEpisodeSelector)}
                className="flex items-center justify-center px-6 py-3 bg-gray-600 rounded-lg hover:bg-gray-700 transition"
              >
                <ChevronDown className="w-5 h-5 mr-2" />
                Select Episode
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

            {/* Episode Selector */}
            {showEpisodeSelector && (
              <div className="mt-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-3">Choose Episode</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-sm text-gray-400 mb-1">Season</label>
                    <select
                      value={selectedSeason}
                      onChange={(e) => {
                        setSelectedSeason(parseInt(e.target.value));
                        setShowSources(false);
                      }}
                      className="w-full bg-gray-900 text-white px-4 py-2 rounded-lg border border-gray-700"
                    >
                      {seasonOptions.map(season => (
                        <option key={season} value={season}>Season {season}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex-1">
                    <label className="block text-sm text-gray-400 mb-1">Episode</label>
                    {loadingSeason ? (
                      <div className="bg-gray-900 text-white px-4 py-2 rounded-lg border border-gray-700 flex items-center">
                        <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></span>
                        Loading...
                      </div>
                    ) : episodeOptions.length > 0 ? (
                      <select
                        value={selectedEpisode}
                        onChange={(e) => {
                          setSelectedEpisode(parseInt(e.target.value));
                          setShowSources(false);
                        }}
                        className="w-full bg-gray-900 text-white px-4 py-2 rounded-lg border border-gray-700"
                      >
                        {episodeOptions.map(episodeNum => {
                          const episode = seasonDetails?.episodes?.find(ep => ep.episode_number === episodeNum);
                          return (
                            <option key={episodeNum} value={episodeNum}>
                              Episode {episodeNum}{episode?.name && !isMobile ? ` - ${episode.name}` : ''}
                            </option>
                          );
                        })}
                      </select>
                    ) : (
                      <div className="bg-gray-900 text-gray-400 px-4 py-2 rounded-lg border border-gray-700">
                        No episodes
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-end">
                    <button
                      onClick={handleGetEpisodeSources}
                      className="px-6 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                      disabled={loadingSources || loadingSeason || episodeOptions.length === 0}
                    >
                      {loadingSources ? (
                        <span className="flex items-center">
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                          Loading...
                        </span>
                      ) : (
                        <>
                          <Play className="w-5 h-5 inline mr-1" /> Get Sources
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Sources Display */}
            {showSources && (
              <div className="mt-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <Play className="w-5 h-5 mr-2 text-green-500" />
                  Season {selectedSeason} Episode {selectedEpisode} - Available Qualities
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
                  <p className="text-gray-400 text-center py-4">No sources available for this episode</p>
                )}
              </div>
            )}

            {/* Cast Section - Load lazily */}
            <div id="cast-section">
              {castLoaded && details.credits?.cast?.length > 0 && (
                <div className="mt-8">
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
          </div>
        </div>
      </div>

      <RatingModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        onSubmit={handleRatingSubmit}
        itemTitle={details.name}
        currentRating={currentRating?.userRating}
        currentReview={currentRating?.review}
      />
    </div>
  );
};

export default TVDetail;