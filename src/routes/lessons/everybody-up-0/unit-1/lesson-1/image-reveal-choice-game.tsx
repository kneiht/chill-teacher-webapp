// Router
import { createFileRoute } from '@tanstack/react-router'

// Components
import PresentationShell from '@/lib/components/presentation/PresentationShell'
import Slide from '@/lib/components/presentation/Slide'
import ImageRevealChoiceGame from '@/lib/components/games/ImageRevealChoiceGame'

// Assets
import vocabData from './assets/vocab.json'
import bg from './assets/bg.png'

const ImageRevealChoiceGameSlide: React.FC<{ isActive: boolean }> = ({
  isActive,
}) => {
  return (
    <Slide isActive={isActive}>
      <ImageRevealChoiceGame vocabData={vocabData} />
    </Slide>
  )
}

const ImageRevealChoiceGameActivity = () => {
  const slides = [ImageRevealChoiceGameSlide]

  return (
    <PresentationShell slides={slides} backgroundUrl={bg} showHome={true} />
  )
}

export const Route = createFileRoute(
  '/lessons/everybody-up-0/unit-1/lesson-1/image-reveal-choice-game',
)({
  component: ImageRevealChoiceGameActivity,
})
