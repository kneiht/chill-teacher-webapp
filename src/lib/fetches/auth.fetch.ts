import type { ApiResponse } from '@/lib/types'

import { API_BASE_URL, getFetch, postFetch } from '.'

// Shapes per guide
export type AuthSuccessData = {
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
}

// Login user (guide: login + password)
export const fetchLogin = (
  data: { login: string; password: string },
): Promise<ApiResponse<AuthSuccessData>> => {
  return postFetch<AuthSuccessData>(`${API_BASE_URL}/auth/login`, data)
}

// Register new user
export const fetchRegister = (
  data: {
    display_name?: string
    username?: string
    email?: string
    password: string
  },
): Promise<ApiResponse<AuthSuccessData>> => {
  return postFetch(`${API_BASE_URL}/auth/register`, data)
}

// Refresh access token
export const fetchRefresh = (
  refreshToken: string,
): Promise<ApiResponse<{ access_token: string }>> => {
  return postFetch(`${API_BASE_URL}/auth/refresh`, { token: refreshToken })
}

// Get current user
export const fetchMe = (): Promise<ApiResponse<AuthSuccessData['user']>> => {
  return getFetch(`${API_BASE_URL}/auth/me`)
}
