import axios from 'axios';
import { API_URL, TOKEN } from './env';

// Create an axios instance
const axiosInstance = axios.create({
  baseURL: API_URL, // Your API base URL
  timeout: 10000, // Set timeout if needed
});

// Add a request interceptor to inject token and dynamic headers
axiosInstance.interceptors.request.use(
  (config) => {
    // Retrieve the token from local storage

    const token = TOKEN;

    // If token exists, add Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // You can also add more custom headers here if needed
    config.headers['Content-Type'] = 'application/json';

    // Return the modified config
    return config;
  },
  error => Promise.reject(error) // Simplified error handling
);

// Optionally add a response interceptor to handle responses globally
axiosInstance.interceptors.response.use(
  (response) => response, // Just return the response data for successful requests
  (error) => {
    // Handle errors globally (optional)
    // Example: if the token is invalid or expired, redirect to login
    if (error.response?.status === 401) {
      // Redirect to login page or handle token expiration
      console.log("Token expired, redirecting to login...");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
