import { useState } from 'react'

// Router
import { createFileRoute, Link } from '@tanstack/react-router'
import { Route as flashcardsRoute } from './flashcards'
import { Route as assignmentsRoute } from './assignments'
import { Route as presentationLessonRoute } from './presentation-lesson'
import { Route as youtubeLessonRoute } from './youtube-lesson'

// Components
import PresentationShell from '@/lib/components/presentation/PresentationShell'
import Slide from '@/lib/components/presentation/Slide'
import { gameComponents, gameInfo } from '@/lib/components/games'
import WoodenButton from '@/lib/components/ui/WoodenButton'

// Assets
import urls from './assets/urls.json'
import vocabData from './assets/vocab.json'
import clozeData from './assets/cloze.json'

const buttonStyle =
  'w-100 text-blue-800 cursor-pointer font-bold py-4 px-2 rounded-xl text-3xl transition-transform transform hover:scale-105'

const LessonHomepageSlide: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const [activeGame, setActiveGame] = useState<string | null>(null)
  const games = gameInfo({ vocabData, hasClozeData: true })

  const GamePlayer = () => {
    if (!activeGame) return null

    const game = games[activeGame]
    if (!game) return null

    const GameComponent = gameComponents[game.component]
    if (!GameComponent) return null

    const props: any = {
      vocabData,
      backgroundUrl: urls.background,
      title: `${game.title} - Multiple Intelligence Theory`,
      onClose: () => setActiveGame(null),
    }

    if (game.component === 'ClozeGame') {
      props.clozeData = clozeData
    }

    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex flex-col items-center justify-center">
        <div className="relative w-full h-full">
          <GameComponent {...props} />
        </div>
      </div>
    )
  }

  return (
    <div className="h-[98%] overflow-auto">
      <Slide isActive={isActive}>
        <div className="flex flex-col items-center justify-start h-full text-center">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-8 mt-6 text-center leading-tight">
            Multiple Intelligence Theory
            <br />
            Lesson 1: Vocabulary - Part 1
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

            {Object.keys(games).map((gameName) => (
              <WoodenButton
                key={gameName}
                onClick={() => setActiveGame(gameName)}
                className={buttonStyle}
              >
                {games[gameName].icon} {gameName}
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
  '/lessons/advanced-topics/multiple-intelligence-theory/lesson-3/',
)({
  component: LessonHomePage,
})
