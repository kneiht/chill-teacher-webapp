// Router
import { createFileRoute, useNavigate } from '@tanstack/react-router'

// Components
import PresentationShell from '@/lib/components/presentation/PresentationShell'
import GoogleSlide from '@/lib/components/activities/GoogleSlide'

// Url
import urls from './assets/urls.json'

export const Route = createFileRoute(
  '/(main)/(students)/lessons/everybody-up-0/unit-1/lesson-1/presentation-lesson',
)({
  component: () => {
    const navigate = useNavigate()
    const goHome = () => navigate({ to: '..' })

    const slides = [
      ({ isActive }: { isActive: boolean }) => (
        <GoogleSlide isActive={isActive} src={urls.googleSlide} />
      ),
    ]

    return <PresentationShell slides={slides} onHomeClick={goHome} />
  },
})
