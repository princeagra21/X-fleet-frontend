import axios, { 
  AxiosInstance, 
  AxiosRequestConfig, 
  AxiosResponse, 
  AxiosError,
  InternalAxiosRequestConfig 
} from 'axios'
import { API_CONFIG, STORAGE_KEYS } from '@/constants'
import type { ApiResponse } from '@/types'

// Create axios instance with default configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.baseUrl,
  timeout: API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Request interceptor to add auth token and other common headers
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add authorization token if available
    const token = typeof window !== 'undefined' 
      ? localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
      : null

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Add request timestamp for debugging
    if (config.headers) {
      config.headers['X-Request-Time'] = Date.now().toString()
    }

    // Log request in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
        params: config.params,
        data: config.data,
      })
    }

    return config
  },
  (error: AxiosError) => {
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor for handling common responses and errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log successful responses in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
      })
    }

    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Try to refresh token
        const refreshToken = typeof window !== 'undefined' 
          ? localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
          : null

        if (refreshToken) {
          const response = await axios.post(`${API_CONFIG.baseUrl}/auth/refresh`, {
            refresh_token: refreshToken,
          })

          const { access_token } = response.data
          
          if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access_token)
          }

          // Retry original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${access_token}`
          }

          return apiClient(originalRequest)
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
          localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
          window.location.href = '/login'
        }
      }
    }

    // Handle network errors
    if (error.code === 'ECONNABORTED') {
      console.error('❌ Request Timeout:', error.message)
    } else if (!error.response) {
      console.error('❌ Network Error:', error.message)
    }

    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      })
    }

    return Promise.reject(error)
  }
)

// API service class with typed methods
export class ApiService {
  private client: AxiosInstance

  constructor() {
    this.client = apiClient
  }

  // Generic GET request
  async get<T = unknown>(
    url: string, 
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.get<ApiResponse<T>>(url, config)
      return response.data
    } catch (error) {
      throw this.handleError(error as AxiosError)
    }
  }

  // Generic POST request
  async post<T = unknown, D = unknown>(
    url: string, 
    data?: D, 
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.post<ApiResponse<T>>(url, data, config)
      return response.data
    } catch (error) {
      throw this.handleError(error as AxiosError)
    }
  }

  // Generic PUT request
  async put<T = unknown, D = unknown>(
    url: string, 
    data?: D, 
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.put<ApiResponse<T>>(url, data, config)
      return response.data
    } catch (error) {
      throw this.handleError(error as AxiosError)
    }
  }

  // Generic PATCH request
  async patch<T = unknown, D = unknown>(
    url: string, 
    data?: D, 
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.patch<ApiResponse<T>>(url, data, config)
      return response.data
    } catch (error) {
      throw this.handleError(error as AxiosError)
    }
  }

  // Generic DELETE request
  async delete<T = unknown>(
    url: string, 
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.delete<ApiResponse<T>>(url, config)
      return response.data
    } catch (error) {
      throw this.handleError(error as AxiosError)
    }
  }

  // File upload with progress
  async uploadFile<T = unknown>(
    url: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<T>> {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await this.client.post<ApiResponse<T>>(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total && onProgress) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            onProgress(progress)
          }
        },
      })

      return response.data
    } catch (error) {
      throw this.handleError(error as AxiosError)
    }
  }

  // Error handler
  private handleError(error: AxiosError): Error {
    if (error.response?.data) {
      const apiError = error.response.data as ApiResponse
      return new Error(apiError.message || apiError.error || 'An error occurred')
    }

    if (error.code === 'ECONNABORTED') {
      return new Error('Request timeout - please try again')
    }

    if (!error.response) {
      return new Error('Network error - please check your connection')
    }

    return new Error(error.message || 'An unexpected error occurred')
  }
}

// Create and export singleton instance
export const apiService = new ApiService()

// Export the raw axios instance for advanced usage
export { apiClient }

// Utility function to check if user is authenticated
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false
  return !!localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
}

// Utility function to logout user
export const logout = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER_PREFERENCES)
    window.location.href = '/login'
  }
}
