import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import YouTube from 'react-youtube';
import { fetchTVDetails } from '../features/tv/tvSlice';
import { fetchSummary } from '../features/ai/aiSlice';
import { addWatchlist } from '../features/user/userSlice';
import { 
  fetchItemRating, 
  fetchAverageRating, 
  rateMovie,
  updateUserRating,
  removeRating 
} from '../features/rating/ratingSlice';
import { fetchTVEpisodeSources } from '../features/tv/tvSlice';
import { playVideo } from '../features/moviebox/movieboxSlice';
import { getStreamUrl, getDownloadUrl, formatFileSize } from '../services/movieboxService';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import RatingModal from '../components/RatingModal';
import RatingDisplay from '../components/RatingDisplay';
import { Heart, Star, Calendar, Film, Play, Sparkles, X, Volume2, VolumeX, Download, ChevronDown } from 'lucide-react';

const TVDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [showAISummary, setShowAISummary] = useState(false);
  const [trailerKey, setTrailerKey] = useState('');
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showTrailerInHero, setShowTrailerInHero] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [showSources, setShowSources] = useState(false);
  const [sources, setSources] = useState([]);
  const [loadingSources, setLoadingSources] = useState(false);
  const [showEpisodeSelector, setShowEpisodeSelector] = useState(false);
  const [seasonDetails, setSeasonDetails] = useState(null);
  const [loadingSeason, setLoadingSeason] = useState(false);
  const [trailerError, setTrailerError] = useState(false);
  const playerRef = useRef(null);

  const { details, loading, error } = useSelector((state) => state.tv || {});
  const { summary, loading: aiLoading } = useSelector((state) => state.ai || {});
  const { itemRatings, averageRatings } = useSelector((state) => state.rating);

  useEffect(() => {
    dispatch(fetchTVDetails(id));
    dispatch(fetchItemRating(id));
    dispatch(fetchAverageRating(id));
  }, [dispatch, id]);

  // Fetch season details when season changes
  useEffect(() => {
    const fetchSeasonDetails = async () => {
      if (!details?.id) return;
      
      setLoadingSeason(true);
      try {
        // Get the TMDB API key from environment variables
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
        console.log('Season details:', data);
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
  }, [details?.id, selectedSeason]);

  // Extract trailer key
  const extractedTrailerKey = useMemo(() => {
    if (details?.videos?.results) {
      const trailer = details.videos.results.find(
        video => video.type === 'Trailer' && video.site === 'YouTube'
      );
      return trailer?.key || '';
    }
    return '';
  }, [details]);

  useEffect(() => {
    if (extractedTrailerKey) {
      setTrailerKey(extractedTrailerKey);
      setShowTrailerInHero(true);
      setTrailerError(false);
    }
  }, [extractedTrailerKey]);

  // YouTube player options
  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 1,
      mute: 1,
      controls: 0,
      showinfo: 0,
      rel: 0,
      loop: 1,
      playlist: trailerKey,
      modestbranding: 1,
      iv_load_policy: 3,
      disablekb: 1,
      fs: 0,
    },
  };

  // When player is ready
  const onPlayerReady = (event) => {
    playerRef.current = event.target;
    event.target.mute(); // Start muted
    event.target.playVideo();
  };

  // Toggle mute without reloading
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

  // Handle player error
  const onPlayerError = (error) => {
    console.log('YouTube player error:', error);
    setTrailerError(true);
  };

  // Generate season options
  const seasonOptions = details?.number_of_seasons 
    ? Array.from({ length: details.number_of_seasons }, (_, i) => i + 1)
    : [1];

  // Generate episode options from season details
  const episodeOptions = useMemo(() => {
    if (seasonDetails?.episodes && seasonDetails.episodes.length > 0) {
      return seasonDetails.episodes.map(ep => ep.episode_number);
    }
    // Return empty array while loading
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
    if (!showAISummary) {
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
        }
      } catch (error) {
        console.error('Error fetching episode sources:', error);
      } finally {
        setLoadingSources(false);
      }
    }
  };

  const handlePlayVideo = (source) => {
    const streamUrl = getStreamUrl(source.url);
    dispatch(playVideo({
      url: streamUrl,
      title: details?.name ? `${details.name} S${selectedSeason}E${selectedEpisode}` : 'Video',
      quality: source.quality
    }));
  };

  // SIMPLE download function like your working HTML
  const handleDownload = (url, quality) => {
    const episodeTitle = `${details.name} S${selectedSeason}E${selectedEpisode}`;
    const filename = `${details.name.replace(/[^a-z0-9]/gi, '_')}_S${selectedSeason}E${selectedEpisode}_${quality}.mp4`;
    
    // Get the download URL
    const downloadUrl = getDownloadUrl(url, episodeTitle, quality);
    
    // Create download link like HTML example
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    link.target = '_blank';
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRatingSubmit = async ({ rating, review }) => {
    if (!details) return;
    const currentRating = itemRatings[id];
    
    if (currentRating?.userRating) {
      await dispatch(updateUserRating({ 
        tmdbId: id, 
        rating, 
        review 
      }));
    } else {
      await dispatch(rateMovie({
        tmdbId: details.id,
        title: details.name,
        poster: details.poster_path,
        rating,
        review,
        media_type: 'tv'
      }));
    }
    
    dispatch(fetchItemRating(id));
    dispatch(fetchAverageRating(id));
    setShowRatingModal(false);
  };

  const handleRemoveRating = async () => {
    if (window.confirm('Remove your rating?')) {
      await dispatch(removeRating(id));
      dispatch(fetchItemRating(id));
      dispatch(fetchAverageRating(id));
    }
  };

  const currentRating = itemRatings[id];

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="pt-24 flex justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  // Show error state
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
      
      {/* Hero Section with Trailer or Backdrop */}
      <div className="relative h-[70vh] w-full overflow-hidden">
        {showTrailerInHero && trailerKey && !trailerError ? (
          <>
            <div className="absolute inset-0">
              <YouTube
                videoId={trailerKey}
                opts={opts}
                onReady={onPlayerReady}
                onError={onPlayerError}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[calc(100%+100px)] h-[calc(100%+100px)]"
                style={{ 
                  pointerEvents: 'none',
                }}
              />
            </div>
            <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />
            
            {/* Sound Toggle Button */}
            <button
              onClick={toggleMute}
              className="absolute bottom-24 right-8 z-20 bg-black/50 p-3 rounded-full hover:bg-black/70 transition"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <VolumeX className="w-6 h-6 text-white" />
              ) : (
                <Volume2 className="w-6 h-6 text-white" />
              )}
            </button>
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
            />
            <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />
          </>
        )}
      </div>

      {/* TV Show Details */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 -mt-48 pb-16">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3 lg:w-1/4">
            <img
              src={details.poster_path 
                ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
                : 'https://via.placeholder.com/500x750?text=No+Poster'
              }
              alt={details.name}
              className="w-full rounded-2xl shadow-2xl"
            />
          </div>

          <div className="md:w-2/3 text-white">
            <h1 className="text-4xl font-bold mb-2">{details.name}</h1>
            
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

            <div className="mb-6">
              <RatingDisplay
                userRating={currentRating?.userRating}
                averageRating={averageRatings[id]?.average}
                totalRatings={averageRatings[id]?.total}
                onRateClick={() => setShowRatingModal(true)}
                isRated={!!currentRating?.userRating}
              />
              
              {currentRating?.userRating && (
                <button
                  onClick={handleRemoveRating}
                  className="mt-2 text-sm text-gray-400 hover:text-red-600 transition"
                >
                  Remove my rating
                </button>
              )}
            </div>

            <p className="text-gray-300 leading-relaxed mb-8">{details.overview || 'No overview available.'}</p>

            {/* Actions */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleAddToWatchlist}
                className="flex items-center px-6 py-3 bg-red-600 rounded-lg hover:bg-red-700 transition"
              >
                <Heart className="w-5 h-5 mr-2" />
                Add to Watchlist
              </button>
              
              <button
                onClick={handleAISummary}
                className="flex items-center px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-700 transition"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                AI Summary
              </button>

              {/* Episode Selector Toggle */}
              <button
                onClick={() => setShowEpisodeSelector(!showEpisodeSelector)}
                className="flex items-center px-6 py-3 bg-gray-600 rounded-lg hover:bg-gray-700 transition"
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
                  <LoadingSpinner />
                ) : (
                  <p className="text-gray-300">{summary || 'No summary available.'}</p>
                )}
              </div>
            )}

            {/* Episode Selector */}
            {showEpisodeSelector && (
              <div className="mt-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-3">Choose Episode</h3>
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-50">
                    <label className="block text-sm text-gray-400 mb-1">Season</label>
                    <select
                      value={selectedSeason}
                      onChange={(e) => {
                        setSelectedSeason(parseInt(e.target.value));
                        setShowSources(false); // Hide sources when season changes
                      }}
                      className="w-full bg-gray-900 text-white px-4 py-2 rounded-lg border border-gray-700"
                    >
                      {seasonOptions.map(season => (
                        <option key={season} value={season}>Season {season}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex-1 min-w-50">
                    <label className="block text-sm text-gray-400 mb-1">Episode</label>
                    {loadingSeason ? (
                      <div className="bg-gray-900 text-white px-4 py-2 rounded-lg border border-gray-700 flex items-center">
                        <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></span>
                        Loading episodes...
                      </div>
                    ) : episodeOptions.length > 0 ? (
                      <select
                        value={selectedEpisode}
                        onChange={(e) => {
                          setSelectedEpisode(parseInt(e.target.value));
                          setShowSources(false); // Hide sources when episode changes
                        }}
                        className="w-full bg-gray-900 text-white px-4 py-2 rounded-lg border border-gray-700"
                      >
                        {episodeOptions.map(episodeNum => {
                          const episode = seasonDetails?.episodes?.find(ep => ep.episode_number === episodeNum);
                          return (
                            <option key={episodeNum} value={episodeNum}>
                              Episode {episodeNum}{episode?.name ? ` - ${episode.name}` : ''}
                            </option>
                          );
                        })}
                      </select>
                    ) : (
                      <div className="bg-gray-900 text-gray-400 px-4 py-2 rounded-lg border border-gray-700">
                        No episode information available
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-end">
                    <button
                      onClick={handleGetEpisodeSources}
                      className="px-6 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
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
                        <div className="flex gap-2">
                          {/* Play button */}
                          <button
                            onClick={() => handlePlayVideo(source)}
                            className="flex-1 flex items-center justify-center px-3 py-2 bg-green-600 rounded hover:bg-green-700 text-sm"
                          >
                            <Play className="w-4 h-4 mr-1" /> Play
                          </button>
                          
                          {/* Download button */}
                          <button
                            onClick={() => handleDownload(source.url, source.quality)}
                            className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 rounded hover:bg-blue-700 text-sm"
                          >
                            <Download className="w-4 h-4 mr-1" /> Download
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

            {/* User's Review Display */}
            {currentRating?.review && (
              <div className="mt-4 p-4 bg-gray-800/50 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-400 mb-1">Your Review</h3>
                <p className="text-white">"{currentRating.review}"</p>
              </div>
            )}
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