// Router
import { createFileRoute, useNavigate, notFound } from '@tanstack/react-router'
import { Route as parentRoute } from './route'

// Activity Components
import Flashcard from '@/lib/components/activities/Flashcard'
import Vocabulary from '@/lib/components/activities/Vocabulary'
import YoutubeSlide from '@/lib/components/activities/YoutubeSlide'
import GoogleSlide from '@/lib/components/activities/GoogleSlide'
import MatchingGame from '@/lib/components/activities/MatchingGame'
import MemoryGame from '@/lib/components/activities/MemoryGame'

// Activity Registry
const activityComponents: Record<string, React.FC<any>> = {
  Flashcard: Flashcard,
  Vocabulary: Vocabulary,
  YoutubeSlide: YoutubeSlide,
  GoogleSlide: GoogleSlide,
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
  const { urls, vocab, title, activities, externalContent } = lessonData

  // Find the activity in the JSON data or auto-generated from externalContent
  let activity = activities.find((a) => a.id === activityId)

  // If not found, check if it's an auto-generated activity (video-* or slide-*)
  if (!activity) {
    if (activityId.startsWith('video-') && externalContent?.videos) {
      const videoId = activityId.replace('video-', '')
      const video = externalContent.videos.find((v) => v.id === videoId)
      if (video) {
        activity = {
          id: activityId,
          title: video.title || 'Video',
          icon: '🎥',
          type: 'YoutubeSlide',
          description: video.title,
          contentType: 'videos',
          contentIds: [videoId],
        }
      }
    } else if (
      activityId.startsWith('slide-') &&
      externalContent?.googleSlides
    ) {
      const slideId = activityId.replace('slide-', '')
      const slide = externalContent.googleSlides.find((s) => s.id === slideId)
      if (slide) {
        activity = {
          id: activityId,
          title: slide.title || 'Presentation',
          icon: '📊',
          type: 'GoogleSlide',
          description: slide.title,
          contentType: 'googleSlides',
          contentIds: [slideId],
        }
      }
    }
  }

  if (!activity) {
    throw notFound()
  }

  const handleClose = () => {
    navigate({ to: '..' })
  }

  // Get component from registry based on type
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

  // Determine props based on activity type
  const isSlideBasedActivity = ['YoutubeSlide', 'GoogleSlide'].includes(
    activity.type,
  )

  // Render the activity component with appropriate props
  if (isSlideBasedActivity) {
    // Get single slide from externalContent pool
    let slideUrl = ''

    if (activity.contentType && activity.contentIds?.[0] && externalContent) {
      const contentPool = externalContent[activity.contentType]
      if (contentPool) {
        const content = contentPool.find(
          (item) => item.id === activity.contentIds![0],
        )
        slideUrl = content?.url || ''
      }
    }

    if (!slideUrl) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-2xl text-red-600">
            Content not found for activity "{activity.id}"
          </div>
        </div>
      )
    }

    return (
      <ActivityComponent
        url={slideUrl}
        title={`${activity.title} - ${title}`}
        backgroundUrl={urls.background}
        onClose={handleClose}
      />
    )
  }

  // Vocab-based activities (Flashcard, Vocabulary, Games)
  return (
    <ActivityComponent
      vocabData={vocab}
      title={`${activity.title} - ${title}`}
      backgroundUrl={urls.background}
      onClose={handleClose}
    />
  )
}

interface ExternalContentItem {
  id: string
  url: string
  title?: string
}
