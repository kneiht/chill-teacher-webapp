// Router
import { createFileRoute } from '@tanstack/react-router'

// Components
import PresentationShell from '@/lib/components/presentation/PresentationShell'
import Slide from '@/lib/components/presentation/Slide'
import UnjumbleGame from '@/lib/components/games/UnjumbleGame'

// Assets
import vocabData from './assets/vocab.json'
import bg from './assets/bg.png'

const UnjumbleGameSlide: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  return (
    <Slide isActive={isActive}>
      <UnjumbleGame vocabData={vocabData} />
    </Slide>
  )
}

const UnjumbleGameActivity = () => {
  const slides = [UnjumbleGameSlide]

  return (
    <PresentationShell slides={slides} backgroundUrl={bg} showHome={true} />
  )
}

export const Route = createFileRoute(
  '/lessons/everybody-up-0/unit-1/lesson-1/unjumble-game',
)({
  component: UnjumbleGameActivity,
})
