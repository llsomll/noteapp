import axios from 'axios'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import { clearAuth, getAccessToken, setAccessToken } from '../utils/auth';
import { refreshToken } from './api-client';

// Create a base Axios instance that points to your FastAPI backend
export const AXIOS_INSTANCE = axios.create({ baseURL: 'http://localhost:8000/', withCredentials: true, })

// Attach token to each request
AXIOS_INSTANCE.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token && config.headers) {
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
      !originalRequest._retry // prevent infinite loops
    ) {
      originalRequest._retry = true;

      try {
        const res = await refreshToken(); // sets cookie
        const newAccessToken = res.access_token;
        setAccessToken(newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return AXIOS_INSTANCE(originalRequest);
      } catch (refreshError) {
        clearAuth(); // logout on failure
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);


// Orval mutator function
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
