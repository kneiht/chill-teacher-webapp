// UI components
import { App as AntApp } from 'antd'

// Hooks
import { useStore } from '@tanstack/react-store'
import { useEffect } from 'react'
import { useLang } from './use-lang'

// Stores
import { Theme, setSelectedTheme, themeStore } from '@/lib/stores/theme.store'
import type { SelectedTheme, ActualTheme } from '@/lib/stores/theme.store'

// Utils
import {
  LocalStorageKeys,
  getFromLocalStorage,
  setToLocalStorage,
} from '@/lib/utils/local-storage-helpers'

// Reuturn for this hook
interface ThemeContextType {
  selectedTheme: SelectedTheme
  actualTheme: ActualTheme
  toggleTheme: () => void
}

// Custom hook for managing theme state (light/dark mode)
export const useTheme = (): ThemeContextType => {
  const { t } = useLang()
  const { message } = AntApp.useApp()
  const state = useStore(themeStore)

  // Load saved theme from localStorage on mount
  useEffect(() => {
    const theme = getFromLocalStorage(LocalStorageKeys.THEME)
    if (theme) {
      setSelectedTheme(theme as SelectedTheme)
    }
  }, [])

  // Save theme changes to localStorage
  useEffect(() => {
    setToLocalStorage(LocalStorageKeys.THEME, state.selectedTheme)
  }, [state.selectedTheme])

  // Toggle between light and dark themes
  const toggleTheme = () => {
    const newTheme =
      state.selectedTheme === Theme.Light ? Theme.Dark : Theme.Light
    setSelectedTheme(newTheme)
    message.success(t(`Theme changed to ${newTheme}`))
  }

  // Return theme state and toggle function
  return {
    selectedTheme: state.selectedTheme,
    actualTheme: state.actualTheme,
    toggleTheme,
  }
}
