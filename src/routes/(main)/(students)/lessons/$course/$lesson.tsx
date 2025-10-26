import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import PresentationShell from '@/lib/components/presentation/PresentationShell'
import Slide from '@/lib/components/presentation/Slide'
import { games } from '@/lib/components/games'
import type { GameDefinition } from '@/lib/components/games'
import WoodenButton from '@/lib/components/ui/WoodenButton'

interface LessonGame {
  game: GameDefinition
  vocabData?: Array<any>
  clozeData?: any
}

export const Route = createFileRoute(
  '/(main)/(students)/lessons/$course/$lesson',
)({
  loader: async ({
    params,
  }): Promise<{ urls: any; vocab: any; cloze: any }> => {
    try {
      const data = (await import(
        `../../mock-data/${params.course}/${params.lesson}.json`
      )) as {
        default: any
      }
      const lessonData = data.default[params.lesson]
      if (!lessonData) {
        throw new Error('Lesson not found')
      }
      return lessonData
    } catch {
      throw new Error('Lesson not found')
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { urls, vocab, cloze } = Route.useLoaderData()

  const [activeGame, setActiveGame] = useState<LessonGame | null>(null)

  const lessonGames: Array<LessonGame> = [
    { game: games.MatchingGame, vocabData: vocab },
    { game: games.MemoryGame, vocabData: vocab },
    { game: games.MultipleChoiceEnViGame, vocabData: vocab },
    { game: games.MultipleChoiceViEnGame, vocabData: vocab },
    { game: games.ListeningTypingEnGame, vocabData: vocab },
    { game: games.ListeningSentenceTypingGame, vocabData: vocab },
    { game: games.VietnameseToEnglishTranslationGame, vocabData: vocab },
    { game: games.ClozeGame, clozeData: cloze },
  ]

  const GamePlayer = () => {
    if (!activeGame) return null

    const GameComponent = activeGame.game.component

    const props: any = {
      backgroundUrl: urls.background,
      title: `${activeGame.game.title} - Lesson`,
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

  const buttonStyle =
    'w-100 text-blue-800 cursor-pointer font-bold py-4 px-2 rounded-xl text-3xl transition-transform transform hover:scale-105'

  return (
    <PresentationShell
      slides={[LessonHomepageSlide]}
      backgroundUrl={urls.background}
    />
  )

  function LessonHomepageSlide({ isActive }: { isActive: boolean }) {
    return (
      <div className="h-[98%] overflow-auto">
        <Slide isActive={isActive}>
          <div className="flex flex-col items-center justify-start h-full text-center">
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-8 mt-6 text-center leading-tight">
              Lesson
            </h1>
            <div className="grid grid-cols-2 gap-x-20 gap-y-7">
              <a
                href={
                  `/lessons/${Route.useParams().lesson}/presentation` as any
                }
              >
                <WoodenButton className={buttonStyle}>
                  📖 Bài giảng
                </WoodenButton>
              </a>

              <a href={`/lessons/${Route.useParams().lesson}/youtube` as any}>
                <WoodenButton className={buttonStyle}>
                  🎥 Video bài giảng
                </WoodenButton>
              </a>

              <a
                href={`/lessons/${Route.useParams().lesson}/flashcards` as any}
              >
                <WoodenButton className={buttonStyle}>
                  🃏 Flashcards
                </WoodenButton>
              </a>

              <a
                href={`/lessons/${Route.useParams().lesson}/assignments` as any}
              >
                <WoodenButton className={buttonStyle}>📝 Nhiệm vụ</WoodenButton>
              </a>

              <a href={`/lessons/${Route.useParams().lesson}/youtube`}>
                <WoodenButton className={buttonStyle}>
                  🎥 Video bài giảng
                </WoodenButton>
              </a>

              <a href={`/lessons/${Route.useParams().lesson}/flashcards`}>
                <WoodenButton className={buttonStyle}>
                  🃏 Flashcards
                </WoodenButton>
              </a>

              <a href={`/lessons/${Route.useParams().lesson}/assignments`}>
                <WoodenButton className={buttonStyle}>📝 Nhiệm vụ</WoodenButton>
              </a>

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
}
