import { Store } from '@tanstack/react-store'

export interface FlashcardSettings {
  initialSide: 'front' | 'back'
  soundEnabled: boolean
}

export const flashcardStore = new Store<FlashcardSettings>({
  initialSide: 'front',
  soundEnabled: true,
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
