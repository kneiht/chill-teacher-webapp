import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import PresentationShell from '@/lib/components/presentation/PresentationShell'
import Slide from '@/lib/components/presentation/Slide'
import WoodenButton from '@/lib/components/ui/WoodenButton'
import Flashcard from '@/lib/components/activities/Flashcard'

interface Activity {
  id: string
  title: string
  icon: string
  type: 'flashcard' | 'link'
  description?: string
  path?: string
}

interface VocabItem {
  word: string
  phonics: string
  image: string
  vietnameseMeaning: string
  sampleSentence: string
  vietnameseTranslation: string
  wordPronunciation?: string
  sentencePronunciation?: string
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

  const [showFlashcards, setShowFlashcards] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleActivityClick = (activity: Activity) => {
    if (activity.type === 'flashcard') {
      setShowFlashcards(true)
      setCurrentIndex(0)
    } else if (activity.type === 'link' && activity.path) {
      window.open(activity.path, '_blank')
    }
  }

  const buttonStyle =
    'w-100 text-blue-800 cursor-pointer font-bold py-4 px-2 rounded-xl text-3xl transition-transform transform hover:scale-105'

  const flashcardSlides = showFlashcards
    ? vocab.map((vocabItem, index) => {
        return function FlashcardSlide({ isActive }: { isActive: boolean }) {
          return <Flashcard vocab={vocabItem} isActive={isActive} />
        }
      })
    : []

  const allSlides = showFlashcards ? flashcardSlides : [LessonHomepageSlide]

  return (
    <>
      <PresentationShell slides={allSlides} backgroundUrl={urls.background} />

      {showFlashcards && (
        <div className="fixed top-4 right-4 z-50 flex gap-2">
          <button
            onClick={handleCloseFlashcards}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-lg text-xl font-bold"
          >
            ✕ Close
          </button>
          <div className="px-6 py-3 bg-white text-gray-800 rounded-lg shadow-lg text-xl font-bold">
            {currentIndex + 1} / {vocab.length}
          </div>
        </div>
      )}
    </>
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
        </Slide>
      </div>
    )
  }
}
