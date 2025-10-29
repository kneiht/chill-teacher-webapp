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

interface ExternalContentItem {
  id: string
  url: string
  title?: string
}

interface MenuItem {
  type: 'activity' | 'page' | 'video' | 'googleSlide' | 'embedPage'
  id: string
}

interface ClozeData {
  paragraph?: string
  words?: string[]
  sentences?: Array<{ sentence: string; word: string }>
}

interface CandyCrushQuestion {
  type:
    | 'multipleChoice'
    | 'listening'
    | 'fillBlank'
    | 'imageChoice'
    | 'imageToVietnamese'
  question: string
  correctAnswer: string
  options?: string[]
  wordToSpeak?: string
  image?: string
}

interface AssignmentQuestion {
  question: string
  type?: 'text' | 'bullet'
}

interface AssignmentTask {
  task: string
  subQuestions?: AssignmentQuestion[]
}

interface AssignmentData {
  lessonTitle: string
  instructions: string
  tasks: AssignmentTask[]
  footer?: string
}

type ContentBlock =
  | {
      type: 'heading'
      level: 1 | 2 | 3 | 4 | 5 | 6
      text: string
      className?: string
    }
  | { type: 'paragraph'; text: string; className?: string }
  | { type: 'html'; content: string }
  | { type: 'list'; ordered: boolean; items: string[]; className?: string }
  | {
      type: 'image'
      src: string
      alt?: string
      caption?: string
      className?: string
    }
  | { type: 'video'; url: string; title?: string; className?: string }
  | {
      type: 'iframe'
      src: string
      title?: string
      height?: string
      className?: string
    }
  | { type: 'divider'; className?: string }
  | {
      type: 'card'
      title?: string
      content: ContentBlock[]
      className?: string
    }
  | { type: 'columns'; columns: ContentBlock[][]; className?: string }
  | { type: 'button'; text: string; href: string; className?: string }
  | { type: 'quote'; text: string; author?: string; className?: string }
  | { type: 'code'; language?: string; code: string; className?: string }
  | { type: 'table'; headers: string[]; rows: string[][]; className?: string }
  | { type: 'spacer'; height?: string }

interface ContentPageData {
  id?: string // For pages array
  title?: string
  subtitle?: string
  content: ContentBlock[]
  footer?: string
  containerClassName?: string
  scrollable?: boolean
}

interface LessonData {
  background: string
  title: string
  description: string
  vocab: VocabItem[]
  clozeData?: ClozeData
  questions?: CandyCrushQuestion[]
  assignmentData?: AssignmentData
  pages?: ContentPageData[] // Array of pages with id
  externalContent?: {
    videos?: ExternalContentItem[]
    googleSlides?: ExternalContentItem[]
    embedPages?: ExternalContentItem[]
  }
  menu: MenuItem[] // Define menu order (all items: videos, slides, pages, activities, embeds)
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
