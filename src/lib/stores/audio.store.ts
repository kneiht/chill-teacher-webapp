import { Store } from '@tanstack/react-store'

// Define audio settings state
export interface AudioState {
  backgroundMusicEnabled: boolean
  soundEffectsEnabled: boolean
  backgroundMusicVolume: number
  soundEffectsVolume: number
}

// Load settings from localStorage or use defaults
const loadAudioSettings = (): AudioState => {
  try {
    const saved = localStorage.getItem('audioSettings')
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (error) {
    console.warn('Failed to load audio settings:', error)
  }

  return {
    backgroundMusicEnabled: true,
    soundEffectsEnabled: true,
    backgroundMusicVolume: 0.3,
    soundEffectsVolume: 0.6,
  }
}

// Save settings to localStorage
const saveAudioSettings = (state: AudioState) => {
  try {
    localStorage.setItem('audioSettings', JSON.stringify(state))
  } catch (error) {
    console.warn('Failed to save audio settings:', error)
  }
}

// Define audio settings store
export const audioStore = new Store<AudioState>(loadAudioSettings())

// Subscribe to changes and save to localStorage
audioStore.subscribe(() => {
  saveAudioSettings(audioStore.state)
})

// Action to toggle background music
export const toggleBackgroundMusic = () => {
  audioStore.setState((prev) => ({
    ...prev,
    backgroundMusicEnabled: !prev.backgroundMusicEnabled,
  }))
}

// Action to toggle sound effects
export const toggleSoundEffects = () => {
  audioStore.setState((prev) => ({
    ...prev,
    soundEffectsEnabled: !prev.soundEffectsEnabled,
  }))
}

// Action to set background music volume
export const setBackgroundMusicVolume = (volume: number) => {
  audioStore.setState((prev) => ({
    ...prev,
    backgroundMusicVolume: Math.max(0, Math.min(1, volume)),
  }))
}

// Action to set sound effects volume
export const setSoundEffectsVolume = (volume: number) => {
  audioStore.setState((prev) => ({
    ...prev,
    soundEffectsVolume: Math.max(0, Math.min(1, volume)),
  }))
}
