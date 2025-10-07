import { Store } from '@tanstack/react-store'

export interface TTSSettings {
  voice: string
  rate: number
}

const defaultSettings: TTSSettings = {
  voice: 'Aaron',
  rate: 1.0,
}

const loadSettings = (): TTSSettings => {
  try {
    const stored = localStorage.getItem('tts-settings')
    return stored
      ? { ...defaultSettings, ...JSON.parse(stored) }
      : defaultSettings
  } catch {
    return defaultSettings
  }
}

export const ttsStore = new Store<TTSSettings>(loadSettings())

ttsStore.subscribe((state) => {
  localStorage.setItem('tts-settings', JSON.stringify(state))
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
