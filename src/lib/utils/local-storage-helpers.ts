// Check the browser environment
export const isBrowser = () => typeof window !== 'undefined'

// Define the keys for the local storage
export enum LocalStorageKeys {
  THEME = 'theme',
  LANG = 'lang',
  USER = 'user',
  FLASHCARD_SETTINGS = 'flashcard-settings',
  TTS_SETTINGS = 'tts-settings',
  REFRESH_TOKEN = 'refresh_token',
}

// Get a value from the local storage
export function getFromLocalStorage<T>(key: LocalStorageKeys): T | null {
  if (isBrowser()) {
    const value = localStorage.getItem(key)
    if (value) {
      return JSON.parse(value) as T
    }
  }
  return null
}

// Set a value to the local storage
export function setToLocalStorage<T>(key: LocalStorageKeys, value: T) {
  if (isBrowser()) {
    localStorage.setItem(key, JSON.stringify(value))
  }
}

// Remove a value from the local storage
export function removeFromLocalStorage(key: LocalStorageKeys) {
  if (isBrowser()) {
    localStorage.removeItem(key)
  }
}
