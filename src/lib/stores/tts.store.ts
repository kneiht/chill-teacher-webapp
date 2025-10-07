import { Store } from '@tanstack/react-store'

export interface TTSSettings {
  voice: string
  rate: number
}

const defaultSettings: TTSSettings = {
  voice: 'Aaron',
  rate: 1.0,
}

export const ttsStore = new Store<TTSSettings>(defaultSettings)

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
