// Game Components
import AnagramGame from './AnagramGame'
import ClozeGame from './ClozeGame'
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
  ClozeGame,
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
  ClozeGame,
  ImageRevealChoiceGame,
  ListeningTypingEnGame,
  PictureTypingEnGame,
  UnjumbleGame,
  ListeningSentenceTypingGame,
  VietnameseToEnglishTranslationGame,
}

export const gameInfo = (
  options: { vocabData: Array<any>; hasClozeData?: boolean } = { vocabData: [] },
) => {
  const hasImages = options.vocabData.some(
    (v) => v.image && v.image.trim() !== '',
  )

  const games: Record<
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
    'Memory Game': {
      title: 'Memory Game',
      component: 'MemoryGame',
      icon: '🎮',
    },
    'Listening & Typing': {
      title: 'Listening & Typing',
      component: 'ListeningTypingEnGame',
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

  if (hasImages) {
    games['Picture Choice'] = {
      title: 'Picture Choice',
      component: 'PictureChoiceEnGame',
      icon: '🎮',
    }
    games['Image Reveal'] = {
      title: 'Image Reveal Choice',
      component: 'ImageRevealChoiceGame',
      icon: '🎮',
    }
    games['Picture Typing'] = {
      title: 'Picture Typing',
      component: 'PictureTypingEnGame',
      icon: '🎮',
    }
  }

  if (options.hasClozeData) {
    games['Cloze Game'] = {
      title: 'Cloze Game',
      component: 'ClozeGame',
      icon: '📝',
    }
  }

  return games
}
