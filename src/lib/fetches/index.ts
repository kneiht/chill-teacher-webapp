import type { ApiResponse } from '@/lib/types'

// Prefer environment variable, fallback to localhost for dev
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

// Handle unauthorized responses by clearing tokens and redirecting
const handleUnauthorized = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('user')
  window.location.href = '/login'
}

let isRefreshing = false
let refreshSubscribers: Array<(token: string) => void> = []

const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback)
}

const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token))
  refreshSubscribers = []
}

const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = localStorage.getItem('refresh_token')
  if (!refreshToken) {
    throw new Error('No refresh token available')
  }

  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token: refreshToken }),
  })

  const body: ApiResponse<{
    access_token: string
    refresh_token: string
    user: {
      id: string
      display_name: string
      username: string
      email: string
      role: string
      status: 'Pending' | 'Active' | 'Suspended'
    }
  }> = await response.json()

  if (body.success && body.data) {
    localStorage.setItem('access_token', body.data.access_token)
    localStorage.setItem('refresh_token', body.data.refresh_token)
    localStorage.setItem('user', JSON.stringify(body.data.user))
    return body.data.access_token
  }

  throw new Error('Token refresh failed')
}

// Base fetch function with common response handling and auto token refresh
const baseFetch = async <T>(
  url: string,
  options: RequestInit,
  retryCount = 0,
): Promise<ApiResponse<T>> => {
  const response = await fetch(url, options)
  const body: ApiResponse<T> = await response.json()

  const isUnauthorized =
    response.status === 401 ||
    (body?.success === false && (body as any).status === 'Unauthorized')

  if (isUnauthorized && retryCount === 0 && !url.includes('/auth/refresh')) {
    if (isRefreshing) {
      return new Promise<ApiResponse<T>>((resolve) => {
        subscribeTokenRefresh((token: string) => {
          const newOptions = {
            ...options,
            headers: {
              ...(options.headers || {}),
              Authorization: `Bearer ${token}`,
            },
          }
          resolve(baseFetch<T>(url, newOptions, retryCount + 1))
        })
      })
    }

    isRefreshing = true

    try {
      const newAccessToken = await refreshAccessToken()
      isRefreshing = false
      onTokenRefreshed(newAccessToken)

      const newOptions = {
        ...options,
        headers: {
          ...(options.headers || {}),
          Authorization: `Bearer ${newAccessToken}`,
        },
      }
      return baseFetch<T>(url, newOptions, retryCount + 1)
    } catch (error) {
      isRefreshing = false
      handleUnauthorized()
      throw error
    }
  }

  if (isUnauthorized && retryCount > 0) {
    handleUnauthorized()
  }

  return body
}

// POST request helper
const postFetch = <T>(
  url: string,
  data: any,
  headers: Record<string, string> = {},
): Promise<ApiResponse<T>> => {
  return baseFetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(data),
  })
}

// PUT request helper
const putFetch = <T>(
  url: string,
  data: any,
  headers: Record<string, string> = {},
): Promise<ApiResponse<T>> => {
  return baseFetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(data),
  })
}

// DELETE request helper
const deleteFetch = <T>(
  url: string,
  headers: Record<string, string> = {},
): Promise<ApiResponse<T>> => {
  return baseFetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  })
}

// GET request helper
const getFetch = <T>(
  url: string,
  headers: Record<string, string> = {},
): Promise<ApiResponse<T>> => {
  return baseFetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  })
}

export { API_BASE_URL, baseFetch, postFetch, putFetch, deleteFetch, getFetch }
export * from './auth.fetch'
export * from './user.fetch'
