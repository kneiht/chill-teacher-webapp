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
import { games, type GameDefinition } from '@/lib/components/games'
import WoodenButton from '@/lib/components/ui/WoodenButton'

// Assets
import urls from './assets/urls.json'
import vocabData from './assets/vocab.json'
import clozeData from './assets/cloze.json'

const buttonStyle =
  'w-100 text-blue-800 cursor-pointer font-bold py-4 px-2 rounded-xl text-3xl transition-transform transform hover:scale-105'

// Game Configuration with VocabData and optional ClozeData
interface LessonGame {
  game: GameDefinition
  vocabData?: Array<any>
  clozeData?: any
}

// Configure which games to include in this lesson
const lessonGames: LessonGame[] = [
  { game: games.MatchingGame, vocabData: vocabData },
  { game: games.MemoryGame, vocabData: vocabData },
  { game: games.MultipleChoiceEnViGame, vocabData: vocabData },
  { game: games.MultipleChoiceViEnGame, vocabData: vocabData },
  { game: games.PictureChoiceEnGame, vocabData: vocabData },
  { game: games.PictureTypingEnGame, vocabData: vocabData },
  { game: games.ListeningTypingEnGame, vocabData: vocabData },
  { game: games.ListeningSentenceTypingGame, vocabData: vocabData },
  { game: games.VietnameseToEnglishTranslationGame, vocabData: vocabData },
  { game: games.ClozeGame, clozeData: clozeData },
]

const LessonHomepageSlide: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const [activeGame, setActiveGame] = useState<LessonGame | null>(null)

  const GamePlayer = () => {
    if (!activeGame) return null

    const GameComponent = activeGame.game.component

    const props: any = {
      backgroundUrl: urls.background,
      title: `${activeGame.game.title} - Multiple Intelligence Theory`,
      onClose: () => setActiveGame(null),
    }

    if (activeGame.vocabData) {
      props.vocabData = activeGame.vocabData
    }

    if (activeGame.clozeData) {
      props.clozeData = activeGame.clozeData
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
            Lesson 3: Vocabulary - Part 3
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
  '/lessons/advanced-topics/multiple-intelligence-theory/lesson-3/',
)({
  component: LessonHomePage,
})
