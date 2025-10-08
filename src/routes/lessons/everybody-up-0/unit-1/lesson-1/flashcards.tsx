// Router
import { createFileRoute, useNavigate } from '@tanstack/react-router'

// Components
import PresentationShell from '@/lib/components/presentation/PresentationShell'
import Flashcard from '@/lib/components/presentation/Flashcard'

// Assets
import vocabData from './assets/vocab.json'
import bg from './assets/bg.png'

export const Route = createFileRoute(
  '/lessons/everybody-up-0/unit-1/lesson-1/flashcards',
)({
  component: () => {
    const navigate = useNavigate()
    const goHome = () =>
      navigate({ to: '/lessons/everybody-up-0/unit-1/lesson-1' })

    const flashcardSlides = vocabData.map(
      (vocab) =>
        ({ isActive }: { isActive: boolean }) => (
          <Flashcard vocab={vocab} isActive={isActive} />
        ),
    )

    return (
      <PresentationShell
        slides={flashcardSlides}
        backgroundUrl={bg}
        onHomeClick={goHome}
        showNavButtons={true}
        showSlideCounter={true}
      />
    )
  },
})
