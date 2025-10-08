import { useState } from 'react'
import vocabData from './assets/vocab.json'

// Router
import { createFileRoute, Link } from '@tanstack/react-router'

// Components
import PresentationShell from '@/lib/components/presentation/PresentationShell'
import Slide from '@/lib/components/presentation/Slide'
import AnagramGame from '@/lib/components/games/AnagramGame'
import MatchingGame from '@/lib/components/games/MatchingGame'
import MultipleChoiceEnViGame from '@/lib/components/games/MultipleChoiceEnViGame'
import MultipleChoiceViEnGame from '@/lib/components/games/MultipleChoiceViEnGame'
import MemoryGame from '@/lib/components/games/MemoryGame'
import ImageRevealChoiceGame from '@/lib/components/games/ImageRevealChoiceGame'
import ListeningTypingEnGame from '@/lib/components/games/ListeningTypingEnGame'
import PictureChoiceEnGame from '@/lib/components/games/PictureChoiceEnGame'
import PictureTypingEnGame from '@/lib/components/games/PictureTypingEnGame'
import UnjumbleGame from '@/lib/components/games/UnjumbleGame'

// Assets
import bg from './assets/bg.png'

const gameComponents: Record<string, React.FC<any>> = {
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
}

const gameInfo: Record<string, { title: string; component: string }> = {
  'Matching Game': { title: 'Matching Game', component: 'MatchingGame' },
  'Anagram Game': { title: 'Anagram Game', component: 'AnagramGame' },
  'Multiple Choice En→Vi': {
    title: 'Multiple Choice (EN → VI)',
    component: 'MultipleChoiceEnViGame',
  },
  'Multiple Choice Vi→En': {
    title: 'Multiple Choice (VI → EN)',
    component: 'MultipleChoiceViEnGame',
  },
  'Picture Choice': {
    title: 'Picture Choice',
    component: 'PictureChoiceEnGame',
  },
  'Memory Game': { title: 'Memory Game', component: 'MemoryGame' },
  'Image Reveal': {
    title: 'Image Reveal Choice',
    component: 'ImageRevealChoiceGame',
  },
  'Listening & Typing': {
    title: 'Listening & Typing',
    component: 'ListeningTypingEnGame',
  },

  'Picture Typing': {
    title: 'Picture Typing',
    component: 'PictureTypingEnGame',
  },
  'Unjumble Game': { title: 'Unjumble Game', component: 'UnjumbleGame' },
}

const buttonStyle =
  'text-blue-800 cursor-pointer font-bold py-4 px-2 rounded-xl text-3xl transition-transform transform hover:scale-105'

const LessonHomepageSlide: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const [activeGame, setActiveGame] = useState<string | null>(null)

  const GamePlayer = () => {
    if (!activeGame) return null

    const game = gameInfo[activeGame]
    if (!game) return null

    const GameComponent = gameComponents[game.component]
    if (!GameComponent) return null

    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex flex-col items-center justify-center">
        <div className="relative w-full h-full">
          <GameComponent
            vocabData={vocabData}
            backgroundUrl={bg}
            title={`${game.title} - School Supplies`}
            onClose={() => setActiveGame(null)}
          />
        </div>
      </div>
    )
  }

  return (
    <Slide isActive={isActive}>
      <div className="flex flex-col items-center justify-start h-full text-center">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-8 mt-6 text-center leading-tight">
          Unit 1: Art Class
          <br />
          Lesson 1: School Supplies
        </h1>
        <div className="grid grid-cols-3 gap-5">
          <Link to="/lessons/everybody-up-0/unit-1/lesson-1/presentation-lesson">
            <button className={buttonStyle}>Bài giảng</button>
          </Link>
          <Link to="/lessons/everybody-up-0/unit-1/lesson-1/youtube-lesson">
            <button className={buttonStyle}>Video bài giảng</button>
          </Link>
          <Link to="/lessons/everybody-up-0/unit-1/lesson-1/flashcards">
            <button className={buttonStyle}>Flashcards</button>
          </Link>

          {Object.keys(gameInfo).map((gameName) => (
            <button
              key={gameName}
              onClick={() => setActiveGame(gameName)}
              className={buttonStyle}
            >
              {gameName}
            </button>
          ))}
        </div>
      </div>

      <GamePlayer />
    </Slide>
  )
}

const LessonHomePage: React.FC = () => {
  const slides = [LessonHomepageSlide]
  return <PresentationShell slides={slides} backgroundUrl={bg} />
}

export const Route = createFileRoute(
  '/lessons/everybody-up-0/unit-1/lesson-1/',
)({
  component: LessonHomePage,
})
