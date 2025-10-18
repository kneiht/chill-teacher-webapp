// Cookies
import Cookies from 'js-cookie'

// Hooks
import { useStore } from '@tanstack/react-store'
import { useEffect } from 'react'

// Types
import type { ApiResponse, UserPublic } from '@/lib/types'

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
import { fetchLogin, fetchRegister } from '@/lib/fetches/auth.fetch'
import type { AuthResponseData } from '../types/auth'

// Return type for this hook
interface AuthContextType {
  user: UserPublic | null
  isLoading: boolean
  isLoggedIn: boolean
  login: (
    email: string,
    password: string,
  ) => Promise<ApiResponse<AuthResponseData>>
  signup: (
    name: string,
    email: string,
    password: string,
  ) => Promise<ApiResponse<AuthResponseData>>
  logout: () => void
  setUser: (user: UserPublic) => void
}

// Custom hook for managing authentication state
export const useAuth = (): AuthContextType => {
  const state = useStore(authStore)

  // Load saved user from localStorage on mount
  useEffect(() => {
    const storedUser = getFromLocalStorage<UserPublic>(LocalStorageKeys.USER)
    if (storedUser) {
      setUser(storedUser)
    }
    setLoading(false)
  }, [])

  // Login user with email and password
  const login = async (
    email: string,
    password: string,
  ): Promise<ApiResponse<AuthResponseData>> => {
    // Set loading state so that the UI can show a loading indicator
    setLoading(true)

    try {
      // Fetch login data from the server
      const result = await fetchLogin({ email, password })

      // Check if the request was successful
      if (result.success && result.data) {
        // Extract user and token data from the response
        const { user, token } = result.data

        // Set the access token cookie
        Cookies.set('accessToken', token.accessToken, {
          secure: false,
          sameSite: 'lax',
          expires: 1,
        })
        // Save user data to localStorage
        setToLocalStorage(LocalStorageKeys.USER, user)
        setUser(user)
      }
      return result
    } finally {
      // Reset loading state
      setLoading(false)
    }
  }

  // Signup new user with name, email, and password
  const signup = async (
    name: string,
    email: string,
    password: string,
  ): Promise<ApiResponse<AuthResponseData>> => {
    // Set loading state so that the UI can show a loading indicator
    setLoading(true)

    try {
      // Fetch signup data from the server
      const result = await fetchRegister({ name, email, password })

      // Check if the request was successful
      if (result.success && result.data) {
        // Extract user and token data from the response
        const { user, token } = result.data

        // Set the access token cookie
        Cookies.set('accessToken', token.accessToken, {
          secure: false,
          sameSite: 'lax',
          expires: 1,
        })

        // Save user data to localStorage
        setToLocalStorage(LocalStorageKeys.USER, user)
        setUser(user)
      }
      return result
    } finally {
      // Reset loading state
      setLoading(false)
    }
  }

  // Logout user by clearing cookies and localStorage
  const logout = () => {
    Cookies.remove('accessToken')
    removeFromLocalStorage(LocalStorageKeys.USER)
    logoutAction()
  }

  // Return auth state and functions
  return {
    user: state.user,
    isLoading: state.isLoading,
    isLoggedIn: state.isLoggedIn,
    login,
    signup,
    logout,
    setUser,
  }
}
