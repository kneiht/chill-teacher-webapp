// Router
import { createFileRoute } from '@tanstack/react-router'

// Components
import ActivityControls from '@/lib/components/presentation/ActivityControls'
import GoogleSlide from '@/lib/components/presentation/GoogleSlide'

const GoogleSlideLesson = () => {
  return (
    <div className="w-screen h-screen bg-black relative">
      <GoogleSlide
        isActive={true}
        src="https://docs.google.com/presentation/d/e/2PACX-1vQD_Kjx3u1n71tBseCyScoYfdSEsQ-Kgc6WFrLRstqat7unOA38uOa0KiL1Xy5sHMMmh7fTbxMycViR/pubembed"
      />
      <ActivityControls />
    </div>
  )
}

export const Route = createFileRoute(
  '/lessons/everybody-up-0/unit-1/lesson-1/lesson',
)({
  component: GoogleSlideLesson,
})
