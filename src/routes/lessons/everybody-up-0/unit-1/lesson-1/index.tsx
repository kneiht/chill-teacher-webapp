import { useState } from 'react'
import vocabData from './assets/vocab.json'

// Router
import { createFileRoute, Link } from '@tanstack/react-router'

// Components
import PresentationShell from '@/lib/components/presentation/PresentationShell'
import Slide from '@/lib/components/presentation/Slide'
import { gameComponents, gameInfo } from '@/lib/components/games'
import WoodenButton from '@/lib/components/ui/WoodenButton'

// Assets
import bg from './assets/bg.png'

const buttonStyle =
  'w-88 text-blue-800 cursor-pointer font-bold py-4 px-2 rounded-xl text-3xl transition-transform transform hover:scale-105'

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
        <div className="grid grid-cols-2 gap-x-20  gap-y-7">
          <Link to="/lessons/everybody-up-0/unit-1/lesson-1/presentation-lesson">
            <WoodenButton className={buttonStyle}>Bài giảng</WoodenButton>
          </Link>
          <Link to="/lessons/everybody-up-0/unit-1/lesson-1/youtube-lesson">
            <WoodenButton className={buttonStyle}>Video bài giảng</WoodenButton>
          </Link>
          <Link to="/lessons/everybody-up-0/unit-1/lesson-1/flashcards">
            <WoodenButton className={buttonStyle}>Flashcards</WoodenButton>
          </Link>

          {Object.keys(gameInfo).map((gameName) => (
            <WoodenButton
              key={gameName}
              onClick={() => setActiveGame(gameName)}
              className={buttonStyle}
            >
              {gameName}
            </WoodenButton>
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
