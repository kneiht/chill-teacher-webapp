import { Store } from '@tanstack/react-store'

import {
  LocalStorageKeys,
  getFromLocalStorage,
  setToLocalStorage,
} from '../utils/local-storage-helpers'

export interface TTSSettings {
  voice: string
  rate: number
}

const defaultSettings: TTSSettings = {
  voice: 'Aaron',
  rate: 1.0,
}

const initialSettings =
  getFromLocalStorage<TTSSettings>(LocalStorageKeys.TTS_SETTINGS) || defaultSettings

export const ttsStore = new Store<TTSSettings>(initialSettings)

// Subscribe to store changes and save to localStorage
ttsStore.subscribe(() => {
  setToLocalStorage(LocalStorageKeys.TTS_SETTINGS, ttsStore.state)
})

export const setVoice = (voice: string) => {
  ttsStore.setState((prev: TTSSettings) => ({
    ...prev,
    voice,
  }))
}

export const setRate = (rate: number) => {
  ttsStore.setState((prev: TTSSettings) => ({
    ...prev,
    rate,
  }))
}