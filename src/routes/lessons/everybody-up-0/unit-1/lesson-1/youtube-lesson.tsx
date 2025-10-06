// Router
import { createFileRoute } from '@tanstack/react-router'

// Components
import PresentationShell from '@/lib/components/presentation/PresentationShell'
import YoutubeSlide from '@/lib/components/presentation/YoutubeSlide'

const YoutubeSlideComponent: React.FC<{ isActive: boolean }> = ({
  isActive,
}) => (
  <YoutubeSlide
    isActive={isActive}
    src="https://www.youtube.com/watch?v=dQw4w9WgXcQ" // Sample YouTube URL
  />
)

const YoutubeSlideLesson = () => {
  const slides = [YoutubeSlideComponent]
  return (
    <PresentationShell slides={slides} showControls={false} showHome={true} />
  )
}

export const Route = createFileRoute(
  '/lessons/everybody-up-0/unit-1/lesson-1/youtube-lesson',
)({
  component: YoutubeSlideLesson,
})
