import { useEffect, useRef, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, AlertCircle, Download, RefreshCw } from 'lucide-react';
import { closePlayer, selectCurrentVideo, selectCurrentTitle, selectCurrentQuality } from '../features/moviebox/movieboxSlice';

const VideoPlayer = () => {
  const dispatch = useDispatch();
  const videoUrl = useSelector(selectCurrentVideo);
  const title = useSelector(selectCurrentTitle);
  const quality = useSelector(selectCurrentQuality);
  const videoRef = useRef(null);
  const prevVideoUrlRef = useRef(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [useAlternative, setUseAlternative] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleClosePlayer = useCallback(() => {
    dispatch(closePlayer());
    setError(null);
    setLoading(true);
    setUseAlternative(false);
  }, [dispatch]);

  useEffect(() => {
    const handleNavClick = (e) => {
      const target = e.target.closest('a');
      if (target && target.getAttribute('href') && !target.getAttribute('href').startsWith('#')) {
        setTimeout(() => {
          handleClosePlayer();
        }, 50);
      }
    };

    document.addEventListener('click', handleNavClick);
    return () => document.removeEventListener('click', handleNavClick);
  }, [handleClosePlayer]);

  const tryAlternativePlayback = useCallback(() => {
    setUseAlternative(true);
    setError(null);
    setLoading(false);
  }, []);

  const openInNewTab = useCallback(() => {
    window.open(videoUrl, '_blank');
  }, [videoUrl]);

  const downloadVideo = useCallback(() => {
    if (isMobile) {
      // On mobile, just open in new tab
      window.open(videoUrl, '_blank');
    } else {
      const link = document.createElement('a');
      link.href = videoUrl;
      link.download = `${title}_${quality}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [videoUrl, title, quality, isMobile]);

  useEffect(() => {
    if (videoUrl !== prevVideoUrlRef.current) {
      setError(null);
      setLoading(true);
      setUseAlternative(false);
      prevVideoUrlRef.current = videoUrl;
    }
  }, [videoUrl]);

  useEffect(() => {
    if (!videoUrl || useAlternative) return;
    
    if (videoRef.current) {
      console.log('Playing video URL:', videoUrl);
      
      const video = videoRef.current;
      
      const handleCanPlay = () => {
        console.log('Video can play now');
        setLoading(false);
        if (!isMobile) {
          video.play().catch(e => console.log('Play failed:', e));
        }
      };
      
      const handleError = (error) => {
        console.error('Video error:', video.error, error);
        setLoading(false);
        
        if (video.error && video.error.code === 4) {
          setError('Video cannot be played directly. Try opening in browser.');
        } else if (video.error) {
          setError(`Error: ${video.error.message || 'Unknown error'}`);
        } else {
          setError('Failed to load video.');
        }
      };
      
      const handleStalled = () => {
        console.log('Video stalled');
        setLoading(true);
      };
      
      const handleWaiting = () => {
        console.log('Video waiting for data');
        setLoading(true);
      };
      
      const handlePlaying = () => {
        console.log('Video playing');
        setLoading(false);
      };
      
      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('error', handleError);
      video.addEventListener('stalled', handleStalled);
      video.addEventListener('waiting', handleWaiting);
      video.addEventListener('playing', handlePlaying);
      
      video.crossOrigin = 'anonymous';
      video.preload = isMobile ? 'metadata' : 'auto'; // Load less on mobile
      
      video.load();
      
      return () => {
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('error', handleError);
        video.removeEventListener('stalled', handleStalled);
        video.removeEventListener('waiting', handleWaiting);
        video.removeEventListener('playing', handlePlaying);
      };
    }
  }, [videoUrl, useAlternative, isMobile]);

  if (!videoUrl) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="absolute inset-0 bg-black/90 pointer-events-none" />
      
      <div className="relative z-10 w-full h-full pointer-events-auto flex items-center justify-center">
        <button
          onClick={handleClosePlayer}
          className="absolute top-2 right-2 md:top-4 md:right-4 z-20 bg-black/50 p-2 rounded-full hover:bg-black/70 transition"
        >
          <X className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </button>

        <div className="absolute top-2 left-2 md:top-4 md:left-4 z-20 text-white bg-black/50 px-3 py-1 md:px-4 md:py-2 rounded-lg">
          <h2 className="text-sm md:text-xl font-bold truncate max-w-[200px] md:max-w-none">
            {title}
          </h2>
          <p className="text-xs md:text-sm text-gray-300">Quality: {quality}</p>
        </div>

        {loading && !error && !useAlternative && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 md:w-12 md:h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {useAlternative ? (
          <div className="bg-gray-900 rounded-lg p-4 md:p-8 max-w-xs md:max-w-md text-center border border-gray-700 mx-4">
            <AlertCircle className="w-12 h-12 md:w-16 md:h-16 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg md:text-xl font-bold text-white mb-2">Cannot Play Video</h3>
            <p className="text-sm md:text-base text-gray-400 mb-6">
              Try these alternatives:
            </p>
            <div className="space-y-2 md:space-y-3">
              <button
                onClick={openInNewTab}
                className="w-full flex items-center justify-center px-4 py-2 md:px-4 md:py-3 bg-green-600 rounded-lg hover:bg-green-700 transition text-white text-sm md:text-base"
              >
                <RefreshCw className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                Open in Browser
              </button>
              <button
                onClick={downloadVideo}
                className="w-full flex items-center justify-center px-4 py-2 md:px-4 md:py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition text-white text-sm md:text-base"
              >
                <Download className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                Download Video
              </button>
              <button
                onClick={() => {
                  setUseAlternative(false);
                  setError(null);
                  setLoading(true);
                  if (videoRef.current) videoRef.current.load();
                }}
                className="w-full flex items-center justify-center px-4 py-2 md:px-4 md:py-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition text-white text-sm md:text-base"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : error ? (
          <div className="bg-gray-900 rounded-lg p-4 md:p-8 max-w-xs md:max-w-md text-center border border-gray-700 mx-4">
            <AlertCircle className="w-12 h-12 md:w-16 md:h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg md:text-xl font-bold text-white mb-2">Playback Error</h3>
            <p className="text-sm md:text-base text-gray-400 mb-6">{error}</p>
            <div className="space-y-2 md:space-y-3">
              <button
                onClick={tryAlternativePlayback}
                className="w-full flex items-center justify-center px-4 py-2 md:px-4 md:py-3 bg-green-600 rounded-lg hover:bg-green-700 transition text-white text-sm md:text-base"
              >
                Try Alternative
              </button>
              <button
                onClick={() => {
                  setError(null);
                  setLoading(true);
                  if (videoRef.current) videoRef.current.load();
                }}
                className="w-full flex items-center justify-center px-4 py-2 md:px-4 md:py-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition text-white text-sm md:text-base"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <video
            ref={videoRef}
            controls
            autoPlay={!isMobile}
            className="max-w-full max-h-full"
            style={{ maxHeight: '90vh', maxWidth: '100vw' }}
            playsInline 
            preload={isMobile ? 'metadata' : 'auto'}
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;