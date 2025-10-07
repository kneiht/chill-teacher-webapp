// Router
import { createFileRoute } from '@tanstack/react-router'

// Components
import PresentationShell from '@/lib/components/presentation/PresentationShell'
import Slide from '@/lib/components/presentation/Slide'
import PictureTypingEnGame from '@/lib/components/games/PictureTypingEnGame'

// Assets
import vocabData from './assets/vocab.json'
import bg from './assets/bg.png'

const PictureTypingEnGameSlide: React.FC<{ isActive: boolean }> = ({
  isActive,
}) => {
  return (
    <Slide isActive={isActive}>
      <PictureTypingEnGame vocabData={vocabData} />
    </Slide>
  )
}

const PictureTypingEnGameActivity = () => {
  const slides = [PictureTypingEnGameSlide]

  return (
    <PresentationShell slides={slides} backgroundUrl={bg} showHome={true} />
  )
}

export const Route = createFileRoute(
  '/lessons/everybody-up-0/unit-1/lesson-1/picture-typing-en-game',
)({
  component: PictureTypingEnGameActivity,
})
