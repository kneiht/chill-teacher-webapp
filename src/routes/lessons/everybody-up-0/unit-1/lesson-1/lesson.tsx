// Router
import { createFileRoute } from '@tanstack/react-router'

// Components
import PresentationShell from '@/lib/components/presentation/PresentationShell'
import GoogleSlide from '@/lib/components/presentation/GoogleSlide'

const GoogleSlideComponent: React.FC<{ isActive: boolean }> = ({
  isActive,
}) => (
  <GoogleSlide
    isActive={isActive}
    src="https://docs.google.com/presentation/d/e/2PACX-1vQD_Kjx3u1n71tBseCyScoYfdSEsQ-Kgc6WFrLRstqat7unOA38uOa0KiL1Xy5sHMMmh7fTbxMycViR/pubembed"
  />
)

const GoogleSlideLesson = () => {
  const slides = [GoogleSlideComponent]
  return (
    <PresentationShell slides={slides} showControls={false} showHome={true} />
  )
}

export const Route = createFileRoute(
  '/lessons/everybody-up-0/unit-1/lesson-1/lesson',
)({
  component: GoogleSlideLesson,
})
