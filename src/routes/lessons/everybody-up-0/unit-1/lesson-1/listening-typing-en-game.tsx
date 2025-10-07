// Router
import { createFileRoute } from '@tanstack/react-router'

// Components
import PresentationShell from '@/lib/components/presentation/PresentationShell'
import Slide from '@/lib/components/presentation/Slide'
import ListeningTypingEnGame from '@/lib/components/games/ListeningTypingEnGame'

// Assets
import vocabData from './assets/vocab.json'
import bg from './assets/bg.png'

const ListeningTypingEnGameSlide: React.FC<{ isActive: boolean }> = ({
  isActive,
}) => {
  return (
    <Slide isActive={isActive}>
      <ListeningTypingEnGame vocabData={vocabData} />
    </Slide>
  )
}

const ListeningTypingEnGameActivity = () => {
  const slides = [ListeningTypingEnGameSlide]

  return (
    <PresentationShell slides={slides} backgroundUrl={bg} showHome={true} />
  )
}

export const Route = createFileRoute(
  '/lessons/everybody-up-0/unit-1/lesson-1/listening-typing-en-game',
)({
  component: ListeningTypingEnGameActivity,
})
