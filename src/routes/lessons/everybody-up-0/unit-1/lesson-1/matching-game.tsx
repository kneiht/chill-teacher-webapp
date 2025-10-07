// Router
import { createFileRoute } from '@tanstack/react-router'

// Components
import PresentationShell from '@/lib/components/presentation/PresentationShell'
import Slide from '@/lib/components/presentation/Slide'
import MatchingGame from '@/lib/components/games/MatchingGame'

// Assets
import bg from './assets/bg.png'

const MatchingGameSlide: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  return (
    <Slide isActive={isActive}>
      <MatchingGame />
    </Slide>
  )
}

const MatchingGameActivity = () => {
  const slides = [MatchingGameSlide]

  return (
    <PresentationShell slides={slides} backgroundUrl={bg} showHome={true} />
  )
}

export const Route = createFileRoute(
  '/lessons/everybody-up-0/unit-1/lesson-1/matching-game',
)({
  component: MatchingGameActivity,
})
