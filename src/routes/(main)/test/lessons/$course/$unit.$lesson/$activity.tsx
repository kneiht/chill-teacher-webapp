// Router
import { createFileRoute, useNavigate, notFound } from '@tanstack/react-router'
import { Route as parentRoute } from './route'

// Activity Components (vocab-based only, slides have dedicated routes)
import Flashcard from '@/lib/components/activities/Flashcard'
import Vocabulary from '@/lib/components/activities/Vocabulary'
import MatchingGame from '@/lib/components/activities/MatchingGame'
import MemoryGame from '@/lib/components/activities/MemoryGame'

// Activity Registry (vocab-based activities only)
const activityComponents: Record<string, React.FC<any>> = {
  Flashcard: Flashcard,
  Vocabulary: Vocabulary,
  MatchingGame: MatchingGame,
  MemoryGame: MemoryGame,
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
  const { urls, vocab, title, activities } = lessonData

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

  // Render vocab-based activity
  return (
    <ActivityComponent
      vocabData={vocab}
      title={`${activity.title} - ${title}`}
      backgroundUrl={urls.background}
      onClose={handleClose}
    />
  )
}
