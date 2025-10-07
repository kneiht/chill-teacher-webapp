// Hooks
import { useStore } from '@tanstack/react-store'
import { useEffect } from 'react'

// Stores
import type { TTSSettings } from '@/lib/stores/tts.store'
import { ttsStore, setVoice, setRate } from '@/lib/stores/tts.store'

// Utils
import {
  LocalStorageKeys,
  getFromLocalStorage,
  setToLocalStorage,
} from '@/lib/utils/local-storage-helpers'

// Return for this hook
interface TTSContextType {
  settings: TTSSettings
  setVoice: (voice: string) => void
  setRate: (rate: number) => void
}

// Custom hook for managing TTS settings
export const useTTS = (): TTSContextType => {
  const state = useStore(ttsStore)

  // Load saved settings from localStorage on mount
  useEffect(() => {
    const settings = getFromLocalStorage<TTSSettings>(
      LocalStorageKeys.TTS_SETTINGS,
    )
    if (settings) {
      ttsStore.setState(settings)
    }
  }, [])

  // Save settings changes to localStorage
  useEffect(() => {
    setToLocalStorage(LocalStorageKeys.TTS_SETTINGS, state)
  }, [state])

  // Return settings and actions
  return {
    settings: state,
    setVoice,
    setRate,
  }
}
