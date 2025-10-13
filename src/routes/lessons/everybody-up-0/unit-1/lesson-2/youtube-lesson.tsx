// Router
import { createFileRoute, useNavigate } from '@tanstack/react-router'

// Components
import PresentationShell from '@/lib/components/presentation/PresentationShell'
import YoutubeSlide from '@/lib/components/presentation/YoutubeSlide'

// Url
import urls from './assets/urls.json'

export const Route = createFileRoute(
  '/lessons/everybody-up-0/unit-1/lesson-2/youtube-lesson',
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
