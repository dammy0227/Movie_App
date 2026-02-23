// Cloudflare Worker URL for streaming/downloading
const WORKER_URL = 'https://movieapp.fatunsindamilare1.workers.dev';

// ✅ UPDATED: Now uses Cloudflare Worker
export const getStreamUrl = (url) => {
  return `${WORKER_URL}/api/moviebox/stream?url=${encodeURIComponent(url)}`;
};

// ✅ UPDATED: Now uses Cloudflare Worker
export const getDownloadUrl = (url, title = "video", quality = "") => {
  const params = new URLSearchParams({ 
    url, 
    title: title || "video", 
    quality: quality || "" 
  });
  return `${WORKER_URL}/api/moviebox/download?${params.toString()}`;
};

// Keep these as they are
export const getDirectUrl = (url) => url;

export const formatFileSize = (bytes) => {
  if (!bytes) return "Unknown size";
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
};