// api.ts
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
console.log("BANG!")
console.log(API_URL)
console.log("BANG!")

// Create an Axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to automatically add JWT from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: Response interceptor to handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized! Redirecting to login...");
      // Redirect to login page (or handle refresh token if implemented)
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
