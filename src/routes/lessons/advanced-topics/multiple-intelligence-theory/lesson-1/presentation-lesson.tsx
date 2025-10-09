// Router
import { createFileRoute, useNavigate } from '@tanstack/react-router'

// Components
import PresentationShell from '@/lib/components/presentation/PresentationShell'
import Vocabulary from '@/lib/components/presentation/Vocabulary'

// Assets
import vocabData from './assets/vocab.json'
import urls from './assets/urls.json'
import Slide from '@/lib/components/presentation/Slide'

const TitleSlide: React.FC<{ isActive: boolean }> = ({ isActive }) => (
  <Slide isActive={isActive}>
    <div className="flex items-center justify-center h-full">
      <h1 className="text-6xl font-bold text-indigo-600 bg-[#ffffffae] px-6 py-3 rounded-lg">
        Multiple Intelligence Theory
      </h1>
    </div>
  </Slide>
)

const vocabularySlides = vocabData.map(
  (vocab) =>
    ({ isActive }: { isActive: boolean }) => (
      <Vocabulary vocab={vocab} isActive={isActive} />
    ),
)

export const Route = createFileRoute(
  '/lessons/advanced-topics/multiple-intelligence-theory/lesson-1/presentation-lesson',
)({
  component: () => {
    const navigate = useNavigate()
    const goHome = () =>
      navigate({
        to: '..',
      })

    return (
      <PresentationShell
        slides={[TitleSlide, ...vocabularySlides]}
        backgroundUrl={urls.background}
        onHomeClick={goHome}
        showNavButtons={true}
        showSlideCounter={true}
      />
    )
  },
})
