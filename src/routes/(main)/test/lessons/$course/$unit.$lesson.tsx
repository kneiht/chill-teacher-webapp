import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import PresentationShell from '@/lib/components/presentation/PresentationShell'
import Slide from '@/lib/components/presentation/Slide'
import { games } from '@/lib/components/games'
import WoodenButton from '@/lib/components/ui/WoodenButton'

interface Activity {
  id: string
  title: string
  icon: string
  type: 'flashcard' | 'link' | 'game'
  description?: string
  path?: string
  gameId?: string
}

interface VocabItem {
  word: string
  translation: string
  definition: string
  example: string
  image?: string
  audio?: string
}

interface LessonData {
  urls: {
    background: string
  }
  title: string
  description: string
  vocab: VocabItem[]
  activities: Activity[]
}

export const Route = createFileRoute(
  '/(main)/test/lessons/$course/$unit/$lesson',
)({
  loader: async ({ params }): Promise<LessonData> => {
    try {
      const data = (await import(
        `../../mock-data/lessons/${params.course}/${params.unit}/${params.lesson}.json`
      )) as {
        default: any
      }

      const lessonData = data.default[params.lesson]
      if (!lessonData) {
        throw new Error('Lesson not found')
      }
      return lessonData
    } catch (error) {
      console.error('Error loading lesson:', error)
      throw new Error('Lesson not found')
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const lessonData = Route.useLoaderData()

  const { urls, title, description, vocab, activities } = lessonData

  const [activeActivity, setActiveActivity] = useState<Activity | null>(null)
  const [showFlashcards, setShowFlashcards] = useState(false)

  const handleActivityClick = (activity: Activity) => {
    if (activity.type === 'flashcard') {
      setShowFlashcards(true)
    } else if (activity.type === 'game') {
      setActiveActivity(activity)
    } else if (activity.type === 'link' && activity.path) {
      window.open(activity.path, '_blank')
    }
  }

  const FlashcardViewer = () => {
    if (!showFlashcards) return null

    const [currentIndex, setCurrentIndex] = useState(0)
    const [isFlipped, setIsFlipped] = useState(false)
    const currentCard = vocab[currentIndex]

    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex flex-col items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full mx-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Flashcards ({currentIndex + 1}/{vocab.length})
            </h2>
            <button
              onClick={() => setShowFlashcards(false)}
              className="text-4xl text-gray-600 hover:text-gray-800"
            >
              ×
            </button>
          </div>

          <div
            className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 min-h-[300px] flex flex-col justify-center items-center cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            {!isFlipped ? (
              <div className="text-center">
                <div className="text-5xl font-bold text-blue-600 mb-4">
                  {currentCard.word}
                </div>
                <div className="text-xl text-gray-600">
                  {currentCard.translation}
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-2xl text-gray-800 mb-4">
                  {currentCard.definition}
                </div>
                <div className="text-xl text-gray-600 italic">
                  "{currentCard.example}"
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => {
                setCurrentIndex((prev) => Math.max(0, prev - 1))
                setIsFlipped(false)
              }}
              disabled={currentIndex === 0}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg disabled:opacity-50 hover:bg-gray-300"
            >
              ← Previous
            </button>
            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              {isFlipped ? 'Show Word' : 'Show Definition'}
            </button>
            <button
              onClick={() => {
                setCurrentIndex((prev) => Math.min(vocab.length - 1, prev + 1))
                setIsFlipped(false)
              }}
              disabled={currentIndex === vocab.length - 1}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg disabled:opacity-50 hover:bg-gray-300"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    )
  }

  const GamePlayer = () => {
    if (!activeActivity || activeActivity.type !== 'game') return null

    const gameDefinition = Object.values(games).find(
      (g) => g.id === activeActivity.gameId,
    )
    if (!gameDefinition) return null

    const GameComponent = gameDefinition.component

    const props: any = {
      backgroundUrl: urls.background,
      title: `${gameDefinition.title} - ${title}`,
      onClose: () => setActiveActivity(null),
      vocabData: vocab,
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
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-4 mt-6 text-center leading-tight">
              {title}
            </h1>
            <p className="text-2xl text-gray-700 mb-8">{description}</p>

            <div className="grid grid-cols-2 gap-x-20 gap-y-7 max-w-4xl">
              {activities.map((activity) => (
                <WoodenButton
                  key={activity.id}
                  onClick={() => handleActivityClick(activity)}
                  className={buttonStyle}
                  title={activity.description}
                >
                  {activity.icon} {activity.title}
                </WoodenButton>
              ))}
            </div>
          </div>

          <FlashcardViewer />
          <GamePlayer />
        </Slide>
      </div>
    )
  }
}
