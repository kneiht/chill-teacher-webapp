// Router
import { createFileRoute } from '@tanstack/react-router'

// Components
import PresentationShell from '@/lib/components/presentation/PresentationShell'
import Slide from '@/lib/components/presentation/Slide'
import MultipleChoiceEnViGame from '@/lib/components/games/MultipleChoiceEnViGame'

// Assets
import vocabData from './assets/vocab.json'
import bg from './assets/bg.png'

const MultipleChoiceEnViGameSlide: React.FC<{ isActive: boolean }> = ({
  isActive,
}) => {
  return (
    <Slide isActive={isActive}>
      <MultipleChoiceEnViGame vocabData={vocabData} />
    </Slide>
  )
}

const MultipleChoiceEnViGameActivity = () => {
  const slides = [MultipleChoiceEnViGameSlide]

  return (
    <PresentationShell slides={slides} backgroundUrl={bg} showHome={true} />
  )
}

export const Route = createFileRoute(
  '/lessons/everybody-up-0/unit-1/lesson-1/multiple-choice-en-vi-game',
)({
  component: MultipleChoiceEnViGameActivity,
})
