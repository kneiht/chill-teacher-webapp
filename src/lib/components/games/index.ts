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
import CandyCrushEnglishGame from './CandyCrushEnglishGame'

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
  CandyCrushEnglishGame,
}

// Game Definition Interface
export interface GameDefinition {
  id: string
  name: string
  title: string
  icon: string
  component: React.FC<any>
  requiresImages?: boolean
  requiresClozeData?: boolean
}

// All Available Games with their metadata
export const games: Record<string, GameDefinition> = {
  MatchingGame: {
    id: 'MatchingGame',
    name: 'Matching Game',
    title: 'Matching Game',
    icon: '🎮',
    component: MatchingGame,
  },
  AnagramGame: {
    id: 'AnagramGame',
    name: 'Anagram Game',
    title: 'Anagram Game',
    icon: '🔤',
    component: AnagramGame,
  },
  MultipleChoiceEnViGame: {
    id: 'MultipleChoiceEnViGame',
    name: 'Multiple Choice En→Vi',
    title: 'Multiple Choice (EN → VI)',
    icon: '🎯',
    component: MultipleChoiceEnViGame,
  },
  MultipleChoiceViEnGame: {
    id: 'MultipleChoiceViEnGame',
    name: 'Multiple Choice Vi→En',
    title: 'Multiple Choice (VI → EN)',
    icon: '🎯',
    component: MultipleChoiceViEnGame,
  },
  MemoryGame: {
    id: 'MemoryGame',
    name: 'Memory Game',
    title: 'Memory Game',
    icon: '🧠',
    component: MemoryGame,
  },
  ListeningTypingEnGame: {
    id: 'ListeningTypingEnGame',
    name: 'Listening & Typing',
    title: 'Listening & Typing',
    icon: '🎧',
    component: ListeningTypingEnGame,
  },
  UnjumbleGame: {
    id: 'UnjumbleGame',
    name: 'Unjumble Game',
    title: 'Unjumble Game',
    icon: '🔀',
    component: UnjumbleGame,
  },
  ListeningSentenceTypingGame: {
    id: 'ListeningSentenceTypingGame',
    name: 'Listening Sentences',
    title: 'Listening & Typing Sentences',
    icon: '🎧',
    component: ListeningSentenceTypingGame,
  },
  VietnameseToEnglishTranslationGame: {
    id: 'VietnameseToEnglishTranslationGame',
    name: 'Vietnamese to English',
    title: 'Vietnamese to English Translation',
    icon: '🌐',
    component: VietnameseToEnglishTranslationGame,
  },
  PictureChoiceEnGame: {
    id: 'PictureChoiceEnGame',
    name: 'Picture Choice',
    title: 'Picture Choice',
    icon: '🖼️',
    component: PictureChoiceEnGame,
    requiresImages: true,
  },
  ImageRevealChoiceGame: {
    id: 'ImageRevealChoiceGame',
    name: 'Image Reveal',
    title: 'Image Reveal Choice',
    icon: '🎨',
    component: ImageRevealChoiceGame,
    requiresImages: true,
  },
  PictureTypingEnGame: {
    id: 'PictureTypingEnGame',
    name: 'Picture Typing',
    title: 'Picture Typing',
    icon: '🖼️',
    component: PictureTypingEnGame,
    requiresImages: true,
  },
  ClozeGame: {
    id: 'ClozeGame',
    name: 'Cloze Game',
    title: 'Cloze Game',
    icon: '📝',
    component: ClozeGame,
    requiresClozeData: true,
  },
  CandyCrushEnglishGame: {
    id: 'CandyCrushEnglishGame',
    name: 'Fruit Game',
    title: 'Fruit Game',
    icon: '🍎',
    component: CandyCrushEnglishGame,
  },
}

// Legacy support - keep gameInfo for backward compatibility
export const gameInfo = (
  options: { vocabData: Array<any>; hasClozeData?: boolean } = {
    vocabData: [],
  },
) => {
  const hasImages = options.vocabData.some(
    (v) => v.image && v.image.trim() !== '',
  )

  const availableGames: Record<
    string,
    { title: string; component: string; icon: string }
  > = {}

  Object.values(games).forEach((game) => {
    const shouldInclude =
      (!game.requiresImages || hasImages) &&
      (!game.requiresClozeData || options.hasClozeData)

    if (shouldInclude) {
      availableGames[game.name] = {
        title: game.title,
        component: game.id,
        icon: game.icon,
      }
    }
  })

  return availableGames
}

// Legacy game components registry
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
  CandyCrushEnglishGame,
}
