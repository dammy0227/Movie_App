import axios from "axios";

const API = axios.create({
  // baseURL: "https://movie-app-5oq9.onrender.com/api", 
    baseURL: "http://localhost:5000/api", 
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
