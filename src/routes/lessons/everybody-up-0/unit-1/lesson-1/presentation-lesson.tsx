// Router
import { createFileRoute } from '@tanstack/react-router'

// Components
import PresentationShell from '@/lib/components/presentation/PresentationShell'
import GoogleSlide from '@/lib/components/presentation/GoogleSlide'

// Url
import urls from './assets/urls.json'

const GoogleSlideComponent: React.FC<{ isActive: boolean }> = ({
  isActive,
}) => <GoogleSlide isActive={isActive} src={urls.googleSlide} />

const GoogleSlideLesson = () => {
  const slides = [GoogleSlideComponent]
  return (
    <PresentationShell slides={slides} showControls={false} showHome={true} />
  )
}

export const Route = createFileRoute(
  '/lessons/everybody-up-0/unit-1/lesson-1/presentation-lesson',
)({
  component: GoogleSlideLesson,
})
