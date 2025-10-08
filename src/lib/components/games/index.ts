// Game Components
import AnagramGame from './AnagramGame'
import MatchingGame from './MatchingGame'
import MultipleChoiceEnViGame from './MultipleChoiceEnViGame'
import MultipleChoiceViEnGame from './MultipleChoiceViEnGame'
import MemoryGame from './MemoryGame'
import ImageRevealChoiceGame from './ImageRevealChoiceGame'
import ListeningTypingEnGame from './ListeningTypingEnGame'
import PictureChoiceEnGame from './PictureChoiceEnGame'
import PictureTypingEnGame from './PictureTypingEnGame'
import UnjumbleGame from './UnjumbleGame'
import ListeningSentenceTypingGame from './ListeningSentenceTypingGame'
import VietnameseToEnglishTranslationGame from './VietnameseToEnglishTranslationGame'

export {
  AnagramGame,
  MatchingGame,
  MultipleChoiceEnViGame,
  MultipleChoiceViEnGame,
  MemoryGame,
  ImageRevealChoiceGame,
  ListeningTypingEnGame,
  PictureChoiceEnGame,
  PictureTypingEnGame,
  UnjumbleGame,
  ListeningSentenceTypingGame,
  VietnameseToEnglishTranslationGame,
}

// Game registry
export const gameComponents: Record<string, React.FC<any>> = {
  AnagramGame,
  MatchingGame,
  MultipleChoiceEnViGame,
  MultipleChoiceViEnGame,
  PictureChoiceEnGame,
  MemoryGame,
  ImageRevealChoiceGame,
  ListeningTypingEnGame,
  PictureTypingEnGame,
  UnjumbleGame,
  ListeningSentenceTypingGame,
  VietnameseToEnglishTranslationGame,
}

export const gameInfo: Record<
  string,
  { title: string; component: string; icon: string }
> = {
  'Matching Game': {
    title: 'Matching Game',
    component: 'MatchingGame',
    icon: '🎮',
  },
  'Anagram Game': {
    title: 'Anagram Game',
    component: 'AnagramGame',
    icon: '🎮',
  },
  'Multiple Choice En→Vi': {
    title: 'Multiple Choice (EN → VI)',
    component: 'MultipleChoiceEnViGame',
    icon: '🎮',
  },
  'Multiple Choice Vi→En': {
    title: 'Multiple Choice (VI → EN)',
    component: 'MultipleChoiceViEnGame',
    icon: '🎮',
  },
  'Picture Choice': {
    title: 'Picture Choice',
    component: 'PictureChoiceEnGame',
    icon: '🎮',
  },
  'Memory Game': { title: 'Memory Game', component: 'MemoryGame', icon: '🎮' },
  'Image Reveal': {
    title: 'Image Reveal Choice',
    component: 'ImageRevealChoiceGame',
    icon: '🎮',
  },
  'Listening & Typing': {
    title: 'Listening & Typing',
    component: 'ListeningTypingEnGame',
    icon: '🎮',
  },
  'Picture Typing': {
    title: 'Picture Typing',
    component: 'PictureTypingEnGame',
    icon: '🎮',
  },
  'Unjumble Game': {
    title: 'Unjumble Game',
    component: 'UnjumbleGame',
    icon: '🎮',
  },
  'Listening Sentences': {
    title: 'Listening & Typing Sentences',
    component: 'ListeningSentenceTypingGame',
    icon: '🎮',
  },
  'Vietnamese to English': {
    title: 'Vietnamese to English Translation',
    component: 'VietnameseToEnglishTranslationGame',
    icon: '🎮',
  },
}
