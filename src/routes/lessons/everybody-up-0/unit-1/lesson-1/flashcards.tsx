// Router
import { createFileRoute } from '@tanstack/react-router'

// Components
import PresentationShell from '@/lib/components/presentation/PresentationShell'
import Flashcard from '@/lib/components/presentation/Flashcard'

// Assets
import vocabData from './assets/vocab.json'
import bg from './assets/bg.png'

const FlashcardsActivity = () => {
  const flashcardSlides = vocabData.map((vocab) => {
    const FlashcardSlide: React.FC<{ isActive: boolean }> = ({ isActive }) => (
      <Flashcard vocab={vocab} isActive={isActive} />
    )
    return FlashcardSlide
  })

  return (
    <PresentationShell
      slides={flashcardSlides}
      backgroundUrl={bg}
      showHome={true}
    />
  )
}

export const Route = createFileRoute(
  '/lessons/everybody-up-0/unit-1/lesson-1/flashcards',
)({
  component: FlashcardsActivity,
})
