// Router
import { createFileRoute } from '@tanstack/react-router'

// Components
import PresentationShell from '@/lib/components/presentation/PresentationShell'
import Slide from '@/lib/components/presentation/Slide'
import PictureChoiceEnGame from '@/lib/components/games/PictureChoiceEnGame'

// Assets
import vocabData from './assets/vocab.json'
import bg from './assets/bg.png'

const PictureChoiceEnGameSlide: React.FC<{ isActive: boolean }> = ({
  isActive,
}) => {
  return (
    <Slide isActive={isActive}>
      <PictureChoiceEnGame vocabData={vocabData} />
    </Slide>
  )
}

const PictureChoiceEnGameActivity = () => {
  const slides = [PictureChoiceEnGameSlide]

  return (
    <PresentationShell slides={slides} backgroundUrl={bg} showHome={true} />
  )
}

export const Route = createFileRoute(
  '/lessons/everybody-up-0/unit-1/lesson-1/picture-choice-en-game',
)({
  component: PictureChoiceEnGameActivity,
})
