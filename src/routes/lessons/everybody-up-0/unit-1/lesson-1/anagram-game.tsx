// Router
import { createFileRoute } from '@tanstack/react-router'

// Components
import PresentationShell from '@/lib/components/presentation/PresentationShell'
import Slide from '@/lib/components/presentation/Slide'
import AnagramGame from '@/lib/components/games/AnagramGame'

// Assets
import vocabData from './assets/vocab.json'
import bg from './assets/bg.png'

const AnagramGameSlide: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  return (
    <Slide isActive={isActive}>
      <AnagramGame vocabData={vocabData} />
    </Slide>
  )
}

const AnagramGameActivity = () => {
  const slides = [AnagramGameSlide]

  return (
    <PresentationShell slides={slides} backgroundUrl={bg} showHome={true} />
  )
}

export const Route = createFileRoute(
  '/lessons/everybody-up-0/unit-1/lesson-1/anagram-game',
)({
  component: AnagramGameActivity,
})
