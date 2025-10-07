// Hooks
import { useStore } from '@tanstack/react-store'
import { useEffect } from 'react'

// Stores
import type { FlashcardSettings } from '@/lib/stores/flashcard.store'
import {
  flashcardStore,
  toggleInitialSide,
  toggleSound,
} from '@/lib/stores/flashcard.store'

// Utils
import {
  LocalStorageKeys,
  getFromLocalStorage,
  setToLocalStorage,
} from '@/lib/utils/local-storage-helpers'

// Return for this hook
interface FlashcardContextType {
  settings: FlashcardSettings
  toggleInitialSide: () => void
  toggleSound: () => void
}

// Custom hook for managing flashcard settings
export const useFlashcard = (): FlashcardContextType => {
  const state = useStore(flashcardStore)

  // Load saved settings from localStorage on mount
  useEffect(() => {
    const settings = getFromLocalStorage<FlashcardSettings>(
      LocalStorageKeys.FLASHCARD_SETTINGS,
    )
    console.log('laod settings: ', settings)
    if (settings) {
      flashcardStore.setState(settings)
    }
  }, [])

  // Save settings changes to localStorage
  useEffect(() => {
    setToLocalStorage(LocalStorageKeys.FLASHCARD_SETTINGS, state)
    console.log(state)
  }, [state])

  // Return settings and actions
  return {
    settings: state,
    toggleInitialSide,
    toggleSound,
  }
}
