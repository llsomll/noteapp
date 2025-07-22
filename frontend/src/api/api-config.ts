import axios from 'axios'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import { clearAuth, getAccessToken, setAccessToken } from '../utils/auth';
import { refreshToken } from './api-client';

// Create a base Axios instance API calls
export const AXIOS_INSTANCE = axios.create({ 
  baseURL: 'http://localhost:8000/', 
  withCredentials: true, // Send cookies
})

// Automatically attach the access token to every outgoing request
AXIOS_INSTANCE.interceptors.request.use((config) => {
  const token = getAccessToken(); // Get access token from memory
  if (token && config.headers) {
    // Add Authorization header if token exists
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


// Intercept 401 errors and try refresh
AXIOS_INSTANCE.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry && // prevent infinite loops
      !originalRequest.url.includes('/auth/refresh')
    ) {
      originalRequest._retry = true; // Mark the request as already retried

      try {
        const res = await refreshToken(); // sets cookie
        const newAccessToken = res.access_token; // new token from response
        setAccessToken(newAccessToken); // Save it in memory

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return AXIOS_INSTANCE(originalRequest); // Retry the original request with the new token
      } catch (refreshError) {
        clearAuth(); // logout on failure
        window.location.href = '/login'; // Full reload to clear all state
        return Promise.reject(refreshError); // stop the retry here
      }
    }

    return Promise.reject(error);
  }
);

 
// Orval mutator function to use this Axios instance
export const customInstance = async <T>(config: AxiosRequestConfig): Promise<T> => {
  // Destructure and ignore `signal` to avoid issues
  const { signal, ...restConfig } = config
  void signal 

  try {
    const response: AxiosResponse<T> = await AXIOS_INSTANCE(restConfig)
    return response.data
  } catch (error) {
    console.error('API request failed:', error)
    throw error
  }
}
