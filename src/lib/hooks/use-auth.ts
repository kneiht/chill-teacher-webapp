// Hooks
import { useStore } from '@tanstack/react-store'
import { useEffect } from 'react'

// Types
import type { ApiResponse } from '@/lib/types'

// Stores
import {
  authStore,
  logout as logoutAction,
  setLoading,
  setUser,
} from '@/lib/stores/auth.store'

// Utils
import {
  LocalStorageKeys,
  getFromLocalStorage,
  removeFromLocalStorage,
  setToLocalStorage,
} from '@/lib/utils/local-storage-helpers'

// Fetches
import {
  fetchLogin,
  fetchMe,
  fetchRefresh,
  fetchRegister
  
} from '@/lib/fetches/auth.fetch'
import type {AuthSuccessData} from '@/lib/fetches/auth.fetch';

// Return type for this hook
interface AuthContextType {
  user: AuthSuccessData['user'] | null
  isLoading: boolean
  isLoggedIn: boolean
  login: (
    login: string,
    password: string,
  ) => Promise<ApiResponse<AuthSuccessData>>
  signup: (
    display_name: string | undefined,
    username: string | undefined,
    email: string | undefined,
    password: string,
  ) => Promise<ApiResponse<AuthSuccessData>>
  logout: () => void
  setUser: (user: AuthSuccessData['user']) => void
  refresh: () => Promise<string>
  getCurrentUser: () => Promise<AuthSuccessData['user'] | null>
}

// Custom hook for managing authentication state
export const useAuth = (): AuthContextType => {
  const state = useStore(authStore)

  // Load saved user from localStorage on mount
  useEffect(() => {
    const storedUser = getFromLocalStorage<AuthSuccessData['user']>(
      LocalStorageKeys.USER,
    )
    if (storedUser) {
      setUser(storedUser as any)
    }
    setLoading(false)
  }, [])

  // Login user
  const login = async (
    login: string,
    password: string,
  ): Promise<ApiResponse<AuthSuccessData>> => {
    setLoading(true)
    try {
      const result = await fetchLogin({ login, password })
      if (result.success && result.data) {
        const { user, access_token, refresh_token } = result.data
        localStorage.setItem('access_token', access_token)
        localStorage.setItem('refresh_token', refresh_token)
        setToLocalStorage(LocalStorageKeys.USER, user)
        setUser(user as any)
      }
      return result
    } finally {
      setLoading(false)
    }
  }

  // Signup new user
  const signup = async (
    display_name: string | undefined,
    username: string | undefined,
    email: string | undefined,
    password: string,
  ): Promise<ApiResponse<AuthSuccessData>> => {
    setLoading(true)
    try {
      const result = await fetchRegister({
        display_name,
        username,
        email,
        password,
      })
      if (result.success && result.data) {
        const { user, access_token, refresh_token } = result.data
        localStorage.setItem('access_token', access_token)
        localStorage.setItem('refresh_token', refresh_token)
        setToLocalStorage(LocalStorageKeys.USER, user)
        setUser(user as any)
      }
      return result
    } finally {
      setLoading(false)
    }
  }

  // Refresh token
  const refresh = async (): Promise<string> => {
    const rt = localStorage.getItem('refresh_token')
    if (!rt) throw new Error('No refresh token available')
    const res = await fetchRefresh(rt)
    if (res.success && res.data) {
      localStorage.setItem('access_token', res.data.access_token)
      return res.data.access_token
    }
    // invalid refresh
    logout()
    throw new Error('Session expired. Please login again.')
  }

  // Get current user
  const getCurrentUser = async (): Promise<AuthSuccessData['user'] | null> => {
    const at = localStorage.getItem('access_token')
    if (!at) return null
    const res = await fetchMe()
    if (res.success && res.data) {
      setToLocalStorage(LocalStorageKeys.USER, res.data)
      setUser(res.data as any)
      return res.data
    }
    return null
  }

  // Logout user by clearing tokens and localStorage
  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    removeFromLocalStorage(LocalStorageKeys.USER)
    logoutAction()
  }

  return {
    user: state.user as any,
    isLoading: state.isLoading,
    isLoggedIn: state.isLoggedIn,
    login,
    signup,
    logout,
    setUser: setUser as any,
    refresh,
    getCurrentUser,
  }
}
