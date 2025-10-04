import { useStore } from '@tanstack/react-store'
import { useEffect } from 'react'
import Cookies from 'js-cookie'
import type { UseCaseResponse, UserPublic } from '@/lib/types'
import {
  authStore,
  logout as logoutAction,
  setLoading,
  setUser,
} from '@/lib/stores/auth.store'
import {
  LocalStorageKeys,
  getFromLocalStorage,
  removeFromLocalStorage,
  setToLocalStorage,
} from '@/lib/utils/local-storage-helpers'
import { fetchLogin, fetchRegister } from '@/lib/fetches/auth.fetch'

interface AuthContextType {
  user: UserPublic | null
  isLoading: boolean
  isLoggedIn: boolean
  login: (
    email: string,
    password: string,
  ) => Promise<
    UseCaseResponse<{ user: UserPublic; token: { accessToken: string } }>
  >
  signup: (
    name: string,
    email: string,
    password: string,
  ) => Promise<
    UseCaseResponse<{ user: UserPublic; token: { accessToken: string } }>
  >
  logout: () => void
  setUser: (user: UserPublic) => void
}

export const useAuth = (): AuthContextType => {
  const state = useStore(authStore)

  useEffect(() => {
    const storedUser = getFromLocalStorage<UserPublic>(LocalStorageKeys.USER)
    if (storedUser) {
      setUser(storedUser)
    }
    setLoading(false)
  }, [])

  const login = async (
    email: string,
    password: string,
  ): Promise<
    UseCaseResponse<{ user: UserPublic; token: { accessToken: string } }>
  > => {
    setLoading(true)
    try {
      const result = await fetchLogin({ email, password })
      if (result.success && result.data) {
        const { user, token } = result.data

        Cookies.set('accessToken', token.accessToken, {
          secure: false,
          sameSite: 'lax',
          expires: 1,
        })
        setToLocalStorage(LocalStorageKeys.USER, { ...user, password: '' })
        setUser(user)
      }
      return result
    } finally {
      setLoading(false)
    }
  }

  const signup = async (
    name: string,
    email: string,
    password: string,
  ): Promise<
    UseCaseResponse<{ user: UserPublic; token: { accessToken: string } }>
  > => {
    setLoading(true)
    try {
      const result = await fetchRegister({ name, email, password })
      if (result.success && result.data) {
        const { user, token } = result.data
        Cookies.set('accessToken', token.accessToken, {
          secure: false,
          sameSite: 'lax',
          expires: 1,
        })
        setToLocalStorage(LocalStorageKeys.USER, user)
        setUser(user)
      }
      return result
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    Cookies.remove('accessToken')
    removeFromLocalStorage(LocalStorageKeys.USER)
    logoutAction()
  }

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
