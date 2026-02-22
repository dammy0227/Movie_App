import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, AlertCircle, Download, RefreshCw } from 'lucide-react';
import { closePlayer, selectCurrentVideo, selectCurrentTitle, selectCurrentQuality } from '../features/moviebox/movieboxSlice';

const VideoPlayer = () => {
  const dispatch = useDispatch();
  const videoUrl = useSelector(selectCurrentVideo);
  const title = useSelector(selectCurrentTitle);
  const quality = useSelector(selectCurrentQuality);
  const videoRef = useRef(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [useAlternative, setUseAlternative] = useState(false);

  // Function to close player
  const handleClosePlayer = () => {
    dispatch(closePlayer());
    setError(null);
    setLoading(true);
    setUseAlternative(false);
  };

  // Listen for navigation events
  useEffect(() => {
    // Create a function to handle route changes
    const handleRouteChange = () => {
      if (videoUrl) {
        handleClosePlayer();
      }
    };

    // Listen for click events on navigation links
    const handleNavClick = (e) => {
      // Check if clicked element is a navigation link
      const target = e.target.closest('a');
      if (target && target.getAttribute('href') && !target.getAttribute('href').startsWith('#')) {
        // Small delay to allow navigation to happen
        setTimeout(() => {
          handleClosePlayer();
        }, 50);
      }
    };

    // Add event listener
    document.addEventListener('click', handleNavClick);

    return () => {
      document.removeEventListener('click', handleNavClick);
    };
  }, [videoUrl]);

  // Function to try alternative playback methods
  const tryAlternativePlayback = () => {
    setUseAlternative(true);
    setError(null);
    setLoading(false);
  };

  // Function to open in new tab
  const openInNewTab = () => {
    window.open(videoUrl, '_blank');
  };

  // Function to download
  const downloadVideo = () => {
    const link = document.createElement('a');
    link.href = videoUrl;
    link.download = `${title}_${quality}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    setError(null);
    setLoading(true);
    setUseAlternative(false);
    
    if (videoUrl && videoRef.current && !useAlternative) {
      console.log('Playing video URL:', videoUrl);
      
      const video = videoRef.current;
      
      const handleCanPlay = () => {
        console.log('Video can play now');
        setLoading(false);
        video.play().catch(e => {
          console.log('Play failed:', e);
          setLoading(false);
        });
      };
      
      const handleError = (error) => {
        console.error('Video error:', video.error, error);
        setLoading(false);
        
        if (video.error && video.error.code === 4) {
          setError('Video cannot be played directly. This might be due to format restrictions or expired links.');
        } else if (video.error) {
          setError(`Error loading video: ${video.error.message || 'Unknown error'}`);
        } else {
          setError('Failed to load video. The source might be unavailable.');
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
      video.preload = 'auto';
      
      video.load();
      
      return () => {
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('error', handleError);
        video.removeEventListener('stalled', handleStalled);
        video.removeEventListener('waiting', handleWaiting);
        video.removeEventListener('playing', handlePlaying);
      };
    }
  }, [videoUrl, useAlternative]);

  // If no video URL, don't render
  if (!videoUrl) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {/* Semi-transparent backdrop - only behind video */}
      <div className="absolute inset-0 bg-black/90 pointer-events-none" />
      
      {/* Video container - only this area blocks clicks */}
      <div className="relative z-10 w-full h-full pointer-events-auto flex items-center justify-center">
        {/* Close button - positioned absolutely within the container */}
        <button
          onClick={handleClosePlayer}
          className="absolute top-4 right-4 z-20 bg-black/50 p-2 rounded-full hover:bg-black/70 transition"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        {/* Video info */}
        <div className="absolute top-4 left-4 z-20 text-white bg-black/50 px-4 py-2 rounded-lg">
          <h2 className="text-xl font-bold">{title}</h2>
          <p className="text-sm text-gray-300">Quality: {quality}</p>
        </div>

        {/* Loading indicator */}
        {loading && !error && !useAlternative && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Alternative playback UI when direct video fails */}
        {useAlternative ? (
          <div className="bg-gray-900 rounded-lg p-8 max-w-md text-center border border-gray-700">
            <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Video Cannot Be Played Directly</h3>
            <p className="text-gray-400 mb-6">
              The video format might not be supported in your browser. Try these alternatives:
            </p>
            <div className="space-y-3">
              <button
                onClick={openInNewTab}
                className="w-full flex items-center justify-center px-4 py-3 bg-green-600 rounded-lg hover:bg-green-700 transition text-white"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Open in New Tab
              </button>
              <button
                onClick={downloadVideo}
                className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition text-white"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Video
              </button>
              <button
                onClick={() => {
                  setUseAlternative(false);
                  setError(null);
                  setLoading(true);
                  if (videoRef.current) {
                    videoRef.current.load();
                  }
                }}
                className="w-full flex items-center justify-center px-4 py-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition text-white"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : error ? (
          <div className="bg-gray-900 rounded-lg p-8 max-w-md text-center border border-gray-700">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Playback Error</h3>
            <p className="text-gray-400 mb-6">{error}</p>
            <div className="space-y-3">
              <button
                onClick={tryAlternativePlayback}
                className="w-full flex items-center justify-center px-4 py-3 bg-green-600 rounded-lg hover:bg-green-700 transition text-white"
              >
                Try Alternative Method
              </button>
              <button
                onClick={() => {
                  setError(null);
                  setLoading(true);
                  if (videoRef.current) {
                    videoRef.current.load();
                  }
                }}
                className="w-full flex items-center justify-center px-4 py-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition text-white"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          /* Video player */
          <video
            ref={videoRef}
            controls
            autoPlay
            className="max-w-full max-h-full"
            style={{ maxHeight: '90vh', maxWidth: '90vw' }}
          >
            <source src={videoUrl} type="video/mp4" />
            <source src={videoUrl} type="video/webm" />
            <source src={videoUrl} type="video/ogg" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;