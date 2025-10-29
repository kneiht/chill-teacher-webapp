// Router
import { createFileRoute, useNavigate, notFound } from '@tanstack/react-router'
import { Route as parentRoute } from './route'

// Activity Components (vocab-based only, slides have dedicated routes)
import Flashcard from '@/lib/components/activities/Flashcard'
import Vocabulary from '@/lib/components/activities/Vocabulary'
import MatchingGame from '@/lib/components/activities/MatchingGame'
import MemoryGame from '@/lib/components/activities/MemoryGame'
import AnagramGame from '@/lib/components/activities/AnagramGame'
import MultipleChoiceEnViGame from '@/lib/components/activities/MultipleChoiceEnViGame'
import MultipleChoiceViEnGame from '@/lib/components/activities/MultipleChoiceViEnGame'
import UnjumbleGame from '@/lib/components/activities/UnjumbleGame'
import ClozeGame from '@/lib/components/activities/ClozeGame'
import PictureChoiceEnGame from '@/lib/components/activities/PictureChoiceEnGame'
import PictureTypingEnGame from '@/lib/components/activities/PictureTypingEnGame'
import ImageRevealChoiceGame from '@/lib/components/activities/ImageRevealChoiceGame'
import ListeningTypingEnGame from '@/lib/components/activities/ListeningTypingEnGame'
import ListeningSentenceTypingGame from '@/lib/components/activities/ListeningSentenceTypingGame'
import VietnameseToEnglishTranslationGame from '@/lib/components/activities/VietnameseToEnglishTranslationGame'
import CandyCrushEnglishGame from '@/lib/components/activities/CandyCrushEnglishGame'
import ContentPageSlide from '@/lib/components/activities/ContentPageSlide'

// Activity Registry (vocab-based activities only)
const activityComponents: Record<string, React.FC<any>> = {
  Flashcard: Flashcard,
  Vocabulary: Vocabulary,
  MatchingGame: MatchingGame,
  MemoryGame: MemoryGame,
  AnagramGame: AnagramGame,
  MultipleChoiceEnViGame: MultipleChoiceEnViGame,
  MultipleChoiceViEnGame: MultipleChoiceViEnGame,
  UnjumbleGame: UnjumbleGame,
  ClozeGame: ClozeGame,
  PictureChoiceEnGame: PictureChoiceEnGame,
  PictureTypingEnGame: PictureTypingEnGame,
  ImageRevealChoiceGame: ImageRevealChoiceGame,
  ListeningTypingEnGame: ListeningTypingEnGame,
  ListeningSentenceTypingGame: ListeningSentenceTypingGame,
  VietnameseToEnglishTranslationGame: VietnameseToEnglishTranslationGame,
  CandyCrushEnglishGame: CandyCrushEnglishGame,
  ContentPageSlide: ContentPageSlide,
}

export const Route = createFileRoute(
  '/(main)/test/lessons/$course/$unit/$lesson/$activity',
)({
  component: ActivityComponent,
})

function ActivityComponent() {
  const navigate = useNavigate()
  const { activity: activityId } = Route.useParams()
  const lessonData = parentRoute.useLoaderData()
  const { urls, vocab, title, activities, clozeData, candyCrushQuestions } =
    lessonData

  // Find the activity in the JSON data
  const activity = activities.find((a) => a.id === activityId)

  if (!activity) {
    throw notFound()
  }

  const handleClose = () => {
    navigate({ to: '..' })
  }

  // Get component from registry (vocab-based activities only)
  const ActivityComponent = activityComponents[activity.type]

  if (!ActivityComponent) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-2xl text-red-600">
          Activity "{activity.type}" not found in activities folder
        </div>
      </div>
    )
  }

  // Prepare props based on activity type
  const baseProps = {
    vocabData: vocab,
    title: `${activity.title} - ${title}`,
    backgroundUrl: urls.background,
    onClose: handleClose,
  }

  // Add special data for specific games
  if (activity.type === 'ClozeGame') {
    return <ActivityComponent {...baseProps} clozeData={clozeData} />
  }

  if (activity.type === 'CandyCrushEnglishGame') {
    return (
      <ActivityComponent {...baseProps} questionsData={candyCrushQuestions} />
    )
  }
  // Render standard vocab-based activity
  return <ActivityComponent {...baseProps} />
}
