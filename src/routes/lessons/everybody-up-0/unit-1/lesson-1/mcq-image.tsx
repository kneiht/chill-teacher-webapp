// Router
import { createFileRoute } from '@tanstack/react-router'

// Components
import GameShell from '@/lib/components/presentation/GameShell'
import MultipleChoiceGame from '@/lib/components/presentation/MultipleChoiceGame'

// Assets
import vocabData from './assets/vocab.json'
import bg from './assets/bg.png'

const McqImageActivity = () => {
  const mcqSlides = vocabData.map((vocab) => {
    const McqSlide: React.FC<{ isActive: boolean }> = ({ isActive }) => (
      <MultipleChoiceGame
        correctVocab={vocab}
        options={vocabData}
        isActive={isActive}
      />
    )
    return McqSlide
  })

  return <GameShell slides={mcqSlides} backgroundUrl={bg} showHome={true} />
}

export const Route = createFileRoute(
  '/lessons/everybody-up-0/unit-1/lesson-1/mcq-image',
)({
  component: McqImageActivity,
})
