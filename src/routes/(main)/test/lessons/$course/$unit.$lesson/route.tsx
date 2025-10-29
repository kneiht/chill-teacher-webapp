import { createFileRoute, Outlet } from '@tanstack/react-router'

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

interface Activity {
  id: string
  title: string
  icon: string
  type: string // Activity type: 'Flashcard', 'MatchingGame', 'MemoryGame', 'YoutubeSlide', etc.
  description?: string
  slides?: Array<{ url: string; title?: string }> // For YoutubeSlide, GoogleSlide
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
        `../../../mock-data/lessons/${params.course}/${params.unit}/${params.lesson}.json`
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
  component: () => <Outlet />,
})
