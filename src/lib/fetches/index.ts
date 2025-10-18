import type { ApiResponse } from '@/lib/types'

const API_BASE_URL = 'http://localhost:3000/api'

// Handle unauthorized responses by clearing token and redirecting
const handleUnauthorized = () => {
  import('js-cookie').then(({ default: Cookies }) => {
    Cookies.remove('accessToken')
    window.location.href = '/auth/login'
  })
}

// Base fetch function with common response handling
const baseFetch = async <T>(
  url: string,
  options: RequestInit,
): Promise<ApiResponse<T>> => {
  const response = await fetch(url, options)
  const body: ApiResponse<T> = await response.json()
  if (body.type === 'UNAUTHORIZED') {
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

export { API_BASE_URL, baseFetch, postFetch, putFetch }
export * from './auth.fetch'
export * from './user.fetch'
