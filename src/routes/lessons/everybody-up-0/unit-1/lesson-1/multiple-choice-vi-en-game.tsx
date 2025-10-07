// Router
import { createFileRoute } from '@tanstack/react-router'

// Components
import PresentationShell from '@/lib/components/presentation/PresentationShell'
import Slide from '@/lib/components/presentation/Slide'
import MultipleChoiceViEnGame from '@/lib/components/games/MultipleChoiceViEnGame'

// Assets
import vocabData from './assets/vocab.json'
import bg from './assets/bg.png'

const MultipleChoiceViEnGameSlide: React.FC<{ isActive: boolean }> = ({
  isActive,
}) => {
  return (
    <Slide isActive={isActive}>
      <MultipleChoiceViEnGame vocabData={vocabData} />
    </Slide>
  )
}

const MultipleChoiceViEnGameActivity = () => {
  const slides = [MultipleChoiceViEnGameSlide]

  return (
    <PresentationShell slides={slides} backgroundUrl={bg} showHome={true} />
  )
}

export const Route = createFileRoute(
  '/lessons/everybody-up-0/unit-1/lesson-1/multiple-choice-vi-en-game',
)({
  component: MultipleChoiceViEnGameActivity,
})
