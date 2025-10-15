import { useState } from 'react'
import vocabData from './assets/vocab.json'
import questionsData from './assets/questions.json'

// Router
import { createFileRoute, Link } from '@tanstack/react-router'
import { Route as flashcardsRoute } from './flashcards'
import { Route as assignmentsRoute } from './assignments'
import { Route as presentationLessonRoute } from './presentation-lesson'
import { Route as youtubeLessonRoute } from './youtube-lesson'

// Components
import PresentationShell from '@/lib/components/presentation/PresentationShell'
import Slide from '@/lib/components/presentation/Slide'
import { games } from '@/lib/components/games'
import type { GameDefinition } from '@/lib/components/games'
import WoodenButton from '@/lib/components/ui/WoodenButton'

// Assets
import urls from './assets/urls.json'

const buttonStyle =
  'w-100 text-blue-800 cursor-pointer font-bold py-4 px-2 rounded-xl text-3xl transition-transform transform hover:scale-105'

// Game Configuration with VocabData
interface LessonGame {
  game: GameDefinition
  vocabData: Array<any>
}

// Configure which games to include in this lesson - just import and assign data!
const lessonGames: Array<LessonGame> = [
  { game: games.CandyCrushEnglishGame, vocabData: vocabData },
]

const LessonHomepageSlide: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const [activeGame, setActiveGame] = useState<LessonGame | null>(null)

  const GamePlayer = () => {
    if (!activeGame) return null

    const GameComponent = activeGame.game.component

    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex flex-col items-center justify-center">
        <div className="relative w-full h-full">
          <GameComponent
            vocabData={activeGame.vocabData}
            questionsData={questionsData}
            backgroundUrl={urls.background}
            title={`${activeGame.game.title} - School Supplies`}
            onClose={() => setActiveGame(null)}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="h-[98%] overflow-auto">
      <Slide isActive={isActive}>
        <div className="flex flex-col items-center justify-start h-full text-center">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-8 mt-6 text-center leading-tight">
            Unit 1: Art Class
            <br />
            Lesson 3: Reading
          </h1>
          <div className="grid grid-cols-2 gap-x-20  gap-y-7">
            <Link to={presentationLessonRoute.to}>
              <WoodenButton className={buttonStyle}>📖 Bài giảng</WoodenButton>
            </Link>

            <Link to={youtubeLessonRoute.to}>
              <WoodenButton className={buttonStyle}>
                🎥 Video bài giảng
              </WoodenButton>
            </Link>

            <Link to={flashcardsRoute.to}>
              <WoodenButton className={buttonStyle}>🃏 Flashcards</WoodenButton>
            </Link>

            <Link to={assignmentsRoute.to}>
              <WoodenButton className={buttonStyle}>📝 Nhiệm vụ</WoodenButton>
            </Link>

            {lessonGames.map((lessonGame) => (
              <WoodenButton
                key={lessonGame.game.id}
                onClick={() => setActiveGame(lessonGame)}
                className={buttonStyle}
              >
                {lessonGame.game.icon} {lessonGame.game.name}
              </WoodenButton>
            ))}
          </div>
        </div>

        <GamePlayer />
      </Slide>
    </div>
  )
}

const LessonHomePage: React.FC = () => {
  const slides = [LessonHomepageSlide]
  return <PresentationShell slides={slides} backgroundUrl={urls.background} />
}

export const Route = createFileRoute(
  '/lessons/everybody-up-0/unit-1/lesson-3/',
)({
  component: LessonHomePage,
})
