import { Store } from '@tanstack/react-store'

import {
  LocalStorageKeys,
  getFromLocalStorage,
  setToLocalStorage,
} from '../utils/local-storage-helpers'

export interface FlashcardSettings {
  initialSide: 'front' | 'back'
  soundEnabled: boolean
}

const defaultSettings: FlashcardSettings = {
  initialSide: 'front',
  soundEnabled: true,
}

const initialSettings =
  getFromLocalStorage<FlashcardSettings>(LocalStorageKeys.FLASHCARD_SETTINGS) ||
  defaultSettings

export const flashcardStore = new Store<FlashcardSettings>(initialSettings)

// Subscribe to store changes and save to localStorage
flashcardStore.subscribe(() => {
  setToLocalStorage(LocalStorageKeys.FLASHCARD_SETTINGS, flashcardStore.state)
})

export const toggleInitialSide = () => {
  flashcardStore.setState((prev: FlashcardSettings) => ({
    ...prev,
    initialSide: prev.initialSide === 'front' ? 'back' : 'front',
  }))
}

export const toggleSound = () => {
  flashcardStore.setState((prev: FlashcardSettings) => ({
    ...prev,
    soundEnabled: !prev.soundEnabled,
  }))
}
