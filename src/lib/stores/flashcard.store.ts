import { Store } from '@tanstack/react-store'

export interface FlashcardSettings {
  initialSide: 'front' | 'back'
}

export const flashcardStore = new Store<FlashcardSettings>({
  initialSide: 'front',
})

export const toggleInitialSide = () => {
  flashcardStore.setState((prev: FlashcardSettings) => ({
    initialSide: prev.initialSide === 'front' ? 'back' : 'front',
  }))
}
