// Router
import { createFileRoute, useNavigate } from '@tanstack/react-router'

// Components
import PresentationShell from '@/lib/components/presentation/PresentationShell'
import YoutubeSlide from '@/lib/components/activities/YoutubeSlide'

// Url
import urls from './assets/urls.json'

export const Route = createFileRoute(
  '/(main)/(students)/lessons/advanced-topics/multiple-intelligence-theory/lesson-5/youtube-lesson',
)({
  component: () => {
    const navigate = useNavigate()
    const goHome = () => navigate({ to: '..' })

    const slides = [
      ({ isActive }: { isActive: boolean }) => (
        <YoutubeSlide isActive={isActive} src={urls.youtubeLesson} />
      ),
    ]

    return <PresentationShell slides={slides} onHomeClick={goHome} />
  },
})
