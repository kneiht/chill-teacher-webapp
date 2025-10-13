// Router
import { createFileRoute, useNavigate } from '@tanstack/react-router'

// Components
import PresentationShell from '@/lib/components/presentation/PresentationShell'
import Flashcard from '@/lib/components/presentation/Flashcard'

// Assets
import vocabData from './assets/vocab.json'
import urls from './assets/urls.json'

export const Route = createFileRoute(
  '/lessons/everybody-up-0/unit-1/lesson-2/flashcards',
)({
  component: () => {
    const navigate = useNavigate()
    const goHome = () => navigate({ to: '..' })

    const flashcardSlides = vocabData.map(
      (vocab) =>
        ({ isActive }: { isActive: boolean }) => (
          <Flashcard vocab={vocab} isActive={isActive} />
        ),
    )

    return (
      <PresentationShell
        slides={flashcardSlides}
        backgroundUrl={urls.background}
        onHomeClick={goHome}
        showNavButtons={true}
        showSlideCounter={true}
      />
    )
  },
})
