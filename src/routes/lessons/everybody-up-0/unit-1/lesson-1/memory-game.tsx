// Router
import { createFileRoute } from '@tanstack/react-router'

// Components
import PresentationShell from '@/lib/components/presentation/PresentationShell'
import Slide from '@/lib/components/presentation/Slide'
import MemoryGame from '@/lib/components/games/MemoryGame'

// Assets
import vocabData from './assets/vocab.json'
import bg from './assets/bg.png'

const MemoryGameSlide: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  return (
    <Slide isActive={isActive}>
      <MemoryGame vocabData={vocabData} />
    </Slide>
  )
}

const MemoryGameActivity = () => {
  const slides = [MemoryGameSlide]

  return (
    <PresentationShell slides={slides} backgroundUrl={bg} showHome={true} />
  )
}

export const Route = createFileRoute(
  '/lessons/everybody-up-0/unit-1/lesson-1/memory-game',
)({
  component: MemoryGameActivity,
})
