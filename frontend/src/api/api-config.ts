import axios from 'axios'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'

// Create a base Axios instance that points to your FastAPI backend
export const AXIOS_INSTANCE = axios.create({ baseURL: 'http://localhost:8000/', withCredentials: true, })

// Orval mutator function
export const customInstance = async <T>(config: AxiosRequestConfig): Promise<T> => {
  const token = localStorage.getItem('access_token')

  // Destructure and ignore `signal` to avoid issues
  const { signal, ...restConfig } = config
  void signal

  try {
    const response: AxiosResponse<T> = await AXIOS_INSTANCE({
      ...restConfig,
      headers: {
        ...restConfig.headers,
        Authorization: token ? `Bearer ${token}` : '',  // Use the token if it exists
      },
    })
    
    return response.data
  } catch (error) {
    console.error('API request failed:', error)
    throw error // Re-throw the error so the calling code can handle it
  }
}
