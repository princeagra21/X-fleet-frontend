'use client'

import { useState, useEffect, useCallback } from 'react'
import { apiService } from '@/lib/api-client'
import type { ApiResponse } from '@/types'

// Generic hook for API calls with loading states
export function useApiCall<T = unknown>() {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const execute = useCallback(async (
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    url: string,
    payload?: unknown
  ): Promise<T | null> => {
    setLoading(true)
    setError(null)

    try {
      let response: ApiResponse<T>

      switch (method) {
        case 'GET':
          response = await apiService.get<T>(url)
          break
        case 'POST':
          response = await apiService.post<T>(url, payload)
          break
        case 'PUT':
          response = await apiService.put<T>(url, payload)
          break
        case 'PATCH':
          response = await apiService.patch<T>(url, payload)
          break
        case 'DELETE':
          response = await apiService.delete<T>(url)
          break
        default:
          throw new Error('Unsupported HTTP method')
      }

      if (response.success && response.data) {
        setData(response.data)
        return response.data
      } else {
        throw new Error(response.message || 'API call failed')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('API call error:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setLoading(false)
  }, [])

  return {
    data,
    loading,
    error,
    execute,
    reset
  }
}

// Hook for fetching data on component mount
export function useFetch<T = unknown>(url: string, dependencies: unknown[] = []) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    if (!url) return

    setLoading(true)
    setError(null)

    try {
      const response = await apiService.get<T>(url)
      
      if (response.success && response.data) {
        setData(response.data)
      } else {
        throw new Error(response.message || 'Failed to fetch data')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data'
      setError(errorMessage)
      console.error('Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [url])

  useEffect(() => {
    fetchData()
  }, [fetchData, ...dependencies])

  const refetch = useCallback(() => {
    fetchData()
  }, [fetchData])

  return {
    data,
    loading,
    error,
    refetch
  }
}

// Hook for mutations (POST, PUT, DELETE)
export function useMutation<TData = unknown, TVariables = unknown>() {
  const [data, setData] = useState<TData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const mutate = useCallback(async (
    method: 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    url: string,
    variables?: TVariables
  ): Promise<TData | null> => {
    setLoading(true)
    setError(null)

    try {
      let response: ApiResponse<TData>

      switch (method) {
        case 'POST':
          response = await apiService.post<TData>(url, variables)
          break
        case 'PUT':
          response = await apiService.put<TData>(url, variables)
          break
        case 'PATCH':
          response = await apiService.patch<TData>(url, variables)
          break
        case 'DELETE':
          response = await apiService.delete<TData>(url)
          break
        default:
          throw new Error('Unsupported HTTP method')
      }

      if (response.success && response.data !== undefined) {
        setData(response.data)
        return response.data
      } else {
        throw new Error(response.message || 'Mutation failed')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Mutation failed'
      setError(errorMessage)
      console.error('Mutation error:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setLoading(false)
  }, [])

  return {
    data,
    loading,
    error,
    mutate,
    reset
  }
}

// Hook for file uploads
export function useFileUpload() {
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<unknown>(null)

  const upload = useCallback(async (url: string, file: File): Promise<unknown> => {
    setLoading(true)
    setError(null)
    setProgress(0)

    try {
      const result = await apiService.uploadFile(url, file, (progressValue) => {
        setProgress(progressValue)
      })

      if (result.success && result.data) {
        setData(result.data)
        return result.data
      } else {
        throw new Error(result.message || 'File upload failed')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'File upload failed'
      setError(errorMessage)
      console.error('File upload error:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setProgress(0)
    setLoading(false)
    setError(null)
    setData(null)
  }, [])

  return {
    upload,
    progress,
    loading,
    error,
    data,
    reset
  }
}

// Hook for paginated data
export function usePagination<T = unknown>(baseUrl: string, pageSize = 10) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [total, setTotal] = useState(0)

  const fetchPage = useCallback(async (pageNumber: number, reset = false) => {
    setLoading(true)
    setError(null)

    try {
      const url = `${baseUrl}?page=${pageNumber}&limit=${pageSize}`
      const response = await apiService.get<{
        data: T[]
        pagination: {
          page: number
          limit: number
          total: number
          hasMore: boolean
        }
      }>(url)

      if (response.success && response.data) {
        const { data: newData, pagination } = response.data
        
        setData(prevData => reset ? newData : [...prevData, ...newData])
        setTotal(pagination.total)
        setHasMore(pagination.hasMore)
        setPage(pageNumber)
      } else {
        throw new Error(response.message || 'Failed to fetch data')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data'
      setError(errorMessage)
      console.error('Pagination error:', err)
    } finally {
      setLoading(false)
    }
  }, [baseUrl, pageSize])

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchPage(page + 1)
    }
  }, [fetchPage, page, loading, hasMore])

  const refresh = useCallback(() => {
    setData([])
    setPage(1)
    setHasMore(true)
    fetchPage(1, true)
  }, [fetchPage])

  useEffect(() => {
    fetchPage(1, true)
  }, [baseUrl, pageSize])

  return {
    data,
    loading,
    error,
    page,
    hasMore,
    total,
    loadMore,
    refresh
  }
}
