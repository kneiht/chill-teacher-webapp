// Router
import { createFileRoute, useNavigate } from '@tanstack/react-router'

// Components
import PresentationShell from '@/lib/components/presentation/PresentationShell'
import Vocabulary from '@/lib/components/activities/Vocabulary'

// Assets
import vocabData from './assets/vocab.json'
import urls from './assets/urls.json'
import Slide from '@/lib/components/presentation/Slide'

const TitleSlide: React.FC<{ isActive: boolean }> = ({ isActive }) => (
  <Slide isActive={isActive}>
    <div className="flex flex-col items-center justify-center h-full gap-5  ">
      <h1 className="text-center text-6xl font-bold text-indigo-600 bg-[#ffffffae] px-6 py-3 rounded-lg">
        Multiple Intelligence Theory
      </h1>
      <h1 className="text-center text-6xl font-bold text-indigo-600 bg-[#ffffffae] px-6 py-3 rounded-lg">
        Vocabulary - Part 3
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
  '/(main)/(students)/lessons/advanced-topics/whales-guardians-of-the-climate/lesson-3/presentation-lesson',
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
