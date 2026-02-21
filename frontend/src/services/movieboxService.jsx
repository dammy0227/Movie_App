import API from "./api";

const API_BASE = 'http://localhost:5000';

export const getStreamUrl = (url) => {
  return `${API_BASE}/api/moviebox/stream?url=${encodeURIComponent(url)}`;
};

export const getDownloadUrl = (url, title, quality) => {

  return `${API_BASE}/api/moviebox/download?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title || 'video')}&quality=${quality || ''}`;
};

export const getDirectUrl = (url) => {
  return url;
};

export const formatFileSize = (bytes) => {
  if (!bytes) return 'Unknown size';
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
};