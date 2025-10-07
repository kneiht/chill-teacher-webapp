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
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-12 mt-12 text-center leading-tight">
          Unit 1: Art Class
          <br />
          Lesson 1: School Supplies
        </h1>
        <div className="grid grid-cols-3 gap-8">
          <Link
            to="/lessons/everybody-up-0/unit-1/lesson-1/presentation-lesson"
            className="font-bold py-6 px-10 rounded-xl text-3xl transition-transform transform hover:scale-105"
          >
            Bài giảng
          </Link>
          <Link
            to="/lessons/everybody-up-0/unit-1/lesson-1/youtube-lesson"
            className="font-bold py-6 px-10 rounded-xl text-3xl transition-transform transform hover:scale-105"
          >
            Video bài giảng
          </Link>
          <Link
            to="/lessons/everybody-up-0/unit-1/lesson-1/flashcards"
            className="font-bold py-6 px-10 rounded-xl text-3xl transition-transform transform hover:scale-105"
          >
            Flashcards
          </Link>
          <Link
            to="/lessons/everybody-up-0/unit-1/lesson-1/mcq-image"
            className="font-bold py-6 px-10 rounded-xl text-3xl transition-transform transform hover:scale-105"
          >
            MCQ Image
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
