import API from "./api";

// Get streaming URL (calls your backend `/api/moviebox/stream`)
export const getStreamUrl = async (url) => {
  try {
    const response = await API.get("/moviebox/stream", {
      params: { url }
    });
    return response.data; // backend should return the actual stream URL
  } catch (error) {
    console.error("Error getting stream URL:", error);
    throw error;
  }
};

// Get download URL (calls your backend `/api/moviebox/download`)
export const getDownloadUrl = async (url, title = "video", quality = "") => {
  try {
    const response = await API.get("/moviebox/download", {
      params: { url, title, quality }
    });
    return response.data; // backend should return actual downloadable URL
  } catch (error) {
    console.error("Error getting download URL:", error);
    throw error;
  }
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