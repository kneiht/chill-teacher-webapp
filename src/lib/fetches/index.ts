import type { ApiResponse } from '@/lib/types'

// Prefer environment variable, fallback to localhost for dev
const API_BASE_URL =
  (import.meta as any)?.env?.VITE_API_BASE_URL ||
  (typeof process !== 'undefined' && (process as any).env?.VITE_API_BASE_URL) ||
  'http://localhost:3000'

// Handle unauthorized responses by clearing tokens and redirecting
const handleUnauthorized = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('user')
  window.location.href = '/login'
}

// Base fetch function with common response handling
const baseFetch = async <T>(
  url: string,
  options: RequestInit,
): Promise<ApiResponse<T>> => {
  const response = await fetch(url, options)
  // Attempt to parse JSON; on failure, throw generic error
  const body: ApiResponse<T> = await response.json()
  // Guide uses success boolean and status string
  if (
    response.status === 401 ||
    (body?.success === false && (body as any).status === 'Unauthorized')
  ) {
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

// Authorized GET helper with token header and auto-refresh handled upstream
const getFetch = <T>(
  url: string,
  headers: Record<string, string> = {},
): Promise<ApiResponse<T>> => {
  const accessToken = localStorage.getItem('access_token')
  return baseFetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: accessToken ? `Bearer ${accessToken}` : '',
      ...headers,
    },
  })
}

export { API_BASE_URL, baseFetch, postFetch, putFetch, getFetch }
export * from './auth.fetch'
export * from './user.fetch'
