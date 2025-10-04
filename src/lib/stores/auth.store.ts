import { Store } from '@tanstack/react-store'
import type { UserPublic } from '@/lib/types'

// Define auth state
export interface AuthState {
  user: UserPublic | null
  isLoading: boolean
  isLoggedIn: boolean
}

// Define auth store
export const authStore = new Store<AuthState>({
  user: null,
  isLoading: true,
  isLoggedIn: false,
})

// Action to set user
export const setUser = (user: UserPublic | null) => {
  authStore.setState((prev: AuthState) => ({
    ...prev,
    user,
    isLoggedIn: !!user,
  }))
}

// Action to set loading
export const setLoading = (isLoading: boolean) => {
  authStore.setState((prev: AuthState) => ({
    ...prev,
    isLoading,
  }))
}

// Action to logout
export const logout = () => {
  authStore.setState(() => ({
    user: null,
    isLoading: false,
    isLoggedIn: false,
  }))
}
