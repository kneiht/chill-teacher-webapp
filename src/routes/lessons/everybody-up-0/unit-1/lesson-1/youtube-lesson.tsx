// Router
import { createFileRoute } from '@tanstack/react-router'

// Components
import PresentationShell from '@/lib/components/presentation/PresentationShell'
import YoutubeSlide from '@/lib/components/presentation/YoutubeSlide'

// Url
import urls from './assets/urls.json'

const YoutubeSlideComponent: React.FC<{ isActive: boolean }> = ({
  isActive,
}) => <YoutubeSlide isActive={isActive} src={urls.youtubeLesson} />

const YoutubeSlideLesson = () => {
  const slides = [YoutubeSlideComponent]
  return <PresentationShell slides={slides} />
}

export const Route = createFileRoute(
  '/lessons/everybody-up-0/unit-1/lesson-1/youtube-lesson',
)({
  component: YoutubeSlideLesson,
})
