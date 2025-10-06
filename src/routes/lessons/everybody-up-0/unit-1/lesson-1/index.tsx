// Router
import { createFileRoute, Link } from '@tanstack/react-router'

// Components
import PresentationShell from '@/lib/components/presentation/PresentationShell'
import Slide from '@/lib/components/presentation/Slide'

// Assets
import bg from './assets/bg.png'

const LessonHomepageSlide: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  return (
    <Slide isActive={isActive}>
      <div className="flex flex-col items-center justify-start h-full text-center">
        <h1 className="text-5xl font-bold text-indigo-700 mb-12 mt-12">
          Present Continuous Tense
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link
            to="/lessons/everybody-up-0/unit-1/lesson-1/lesson"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-6 px-10 rounded-xl text-3xl transition-transform transform hover:scale-105"
          >
            Bài giảng
          </Link>
          <Link
            to="/lessons/everybody-up-0/unit-1/lesson-1/exercises"
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-6 px-10 rounded-xl text-3xl transition-transform transform hover:scale-105"
          >
            Bài tập
          </Link>
        </div>
      </div>
    </Slide>
  )
}

const LessonHomePage: React.FC = () => {
  const slides = [LessonHomepageSlide]
  return (
    <PresentationShell
      slides={slides}
      backgroundUrl={bg}
      showControls={false}
      showHome={false}
    />
  )
}

export const Route = createFileRoute(
  '/lessons/everybody-up-0/unit-1/lesson-1/',
)({
  component: LessonHomePage,
})
