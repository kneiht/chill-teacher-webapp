import { Store } from '@tanstack/react-store'

// Define theme
export enum Theme {
  Light = 'light',
  Dark = 'dark',
  System = 'system',
}

// Define theme state
export type SelectedTheme = Theme
export type ActualTheme = Exclude<Theme, Theme.System>
export interface ThemeState {
  selectedTheme: SelectedTheme
  actualTheme: ActualTheme
}

// Define theme store
export const themeStore = new Store<ThemeState>({
  selectedTheme: Theme.System,
  actualTheme: Theme.Light,
})

// Get system theme preference
const getSystemTheme = (): ActualTheme => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? Theme.Dark
      : Theme.Light
  }
  return Theme.Light
}

// Action to set selected theme
export const setSelectedTheme = (selectedTheme: SelectedTheme) => {
  themeStore.setState((_prev: ThemeState) => {
    const actualTheme =
      selectedTheme === Theme.System ? getSystemTheme() : selectedTheme
    return {
      selectedTheme,
      actualTheme,
    }
  })
}

// Action to toggle theme
export const toggleTheme = () => {
  themeStore.setState((prev: ThemeState) => {
    const newSelected =
      prev.selectedTheme === Theme.Light ? Theme.Dark : Theme.Light
    return {
      selectedTheme: newSelected,
      actualTheme: newSelected,
    }
  })
}
