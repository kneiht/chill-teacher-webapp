import { App as AntApp } from 'antd'
import { useStore } from '@tanstack/react-store'
import { useEffect } from 'react'
import { useLang } from './use-lang'
import type { ThemeState } from '@/lib/stores/theme.store'
import { Theme, setSelectedTheme, themeStore } from '@/lib/stores/theme.store'
import {
  LocalStorageKeys,
  getFromLocalStorage,
  setToLocalStorage,
} from '@/lib/utils/local-storage-helpers'

type SelectedTheme = Theme
type ActualTheme = Exclude<Theme, Theme.System>

interface ThemeContextType {
  selectedTheme: SelectedTheme
  actualTheme: ActualTheme
  toggleTheme: () => void
}

export const useTheme = (): ThemeContextType => {
  const { message } = AntApp.useApp()
  const { t } = useLang()
  const state = useStore(themeStore)

  useEffect(() => {
    const theme = getFromLocalStorage(LocalStorageKeys.THEME)
    if (theme) {
      setSelectedTheme(theme as SelectedTheme)
    }
  }, [])

  useEffect(() => {
    setToLocalStorage(LocalStorageKeys.THEME, state.selectedTheme)
  }, [state.selectedTheme])

  const toggleTheme = () => {
    const newTheme =
      state.selectedTheme === Theme.Light ? Theme.Dark : Theme.Light
    setSelectedTheme(newTheme)
    message.success(t(`Theme changed to ${newTheme}`))
  }

  return {
    selectedTheme: state.selectedTheme,
    actualTheme: state.actualTheme,
    toggleTheme,
  }
}
