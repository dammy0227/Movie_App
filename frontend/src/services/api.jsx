import axios from "axios";

const API = axios.create({
  baseURL: "https://movie-app-5oq9.onrender.com/api", 
<<<<<<< HEAD
  
=======
>>>>>>> 9f79863cc8a29cab049d0bdaa7f586b2f5c9eb5f
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
