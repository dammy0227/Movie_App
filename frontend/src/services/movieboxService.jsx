import API from "./api";

// Get stream URL - returns the full URL to the backend stream endpoint
export const getStreamUrl = (url) => {
  // Return the actual URL string, not a promise
  return `${API.defaults.baseURL}/moviebox/stream?url=${encodeURIComponent(url)}`;
};

// Get download URL - returns the full URL to the backend download endpoint
export const getDownloadUrl = (url, title = "video", quality = "") => {
  const params = new URLSearchParams({ url, title, quality });
  return `${API.defaults.baseURL}/moviebox/download?${params}`;
};

// Direct URL (no backend)
export const getDirectUrl = (url) => url;

// Format file size
export const formatFileSize = (bytes) => {
  if (!bytes) return "Unknown size";
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
};