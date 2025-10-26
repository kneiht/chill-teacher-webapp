import { createFileRoute, useNavigate } from '@tanstack/react-router'
import PresentationShell from '@/lib/components/presentation/PresentationShell'
import Slide from '@/lib/components/presentation/Slide'
import urls from './assets/urls.json'

const ReadingAssessmentSlide: React.FC<{ isActive: boolean }> = ({
  isActive,
}) => {
  return (
    <Slide isActive={isActive} scrollable={true}>
      <div className="flex flex-row gap-2 h-full w-full">
        <iframe
          src="/embed/everybody-up-0/shadowing/index.html"
          className="w-full h-full border-0"
          title="Shadowing"
        />
      </div>
    </Slide>
  )
}

const HomeworkPage: React.FC = () => {
  const navigate = useNavigate()
  const goHome = () => navigate({ to: '..' })
  const slides = [ReadingAssessmentSlide]
  return (
    <PresentationShell
      slides={slides}
      backgroundUrl={urls.background}
      onHomeClick={goHome}
      showNavButtons={false}
      showOutlineButton={false}
      showSlideCounter={false}
    />
  )
}

export const Route = createFileRoute(
  '/(main)/(students)/lessons/everybody-up-0/unit-1/lesson-4/shadowing',
)({
  component: HomeworkPage,
})
