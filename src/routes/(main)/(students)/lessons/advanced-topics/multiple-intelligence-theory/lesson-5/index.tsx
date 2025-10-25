// Router
import { createFileRoute, Link } from '@tanstack/react-router'
import { Route as assignmentsRoute } from './assignments'
import { Route as exercisesRoute } from './exercises'
import { Route as youtubeLessonRoute } from './youtube-lesson'

// Components
import PresentationShell from '@/lib/components/presentation/PresentationShell'
import Slide from '@/lib/components/presentation/Slide'
import WoodenButton from '@/lib/components/ui/WoodenButton'

// Assets
import urls from './assets/urls.json'

const buttonStyle =
  'w-100 text-blue-800 cursor-pointer font-bold py-4 px-2 rounded-xl text-3xl transition-transform transform hover:scale-105'

const LessonHomepageSlide: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  return (
    <div className="h-[98%] overflow-auto">
      <Slide isActive={isActive}>
        <div className="flex flex-col items-center justify-start h-full text-center">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-8 mt-6 text-center leading-tight">
            Multiple Intelligence Theory
            <br />
            Lesson 5: Listening
          </h1>
          <div className="grid grid-cols-2 gap-x-20  gap-y-7">
            <Link to={youtubeLessonRoute.to}>
              <WoodenButton className={buttonStyle}>
                🎥 Video Overview
              </WoodenButton>
            </Link>

            <Link to={assignmentsRoute.to}>
              <WoodenButton className={buttonStyle}>
                📝 Assignments
              </WoodenButton>
            </Link>

            <Link to={exercisesRoute.to}>
              <WoodenButton className={buttonStyle}>
                📝 Listening Exercises
              </WoodenButton>
            </Link>
          </div>
        </div>
      </Slide>
    </div>
  )
}

const LessonHomePage: React.FC = () => {
  const slides = [LessonHomepageSlide]
  return <PresentationShell slides={slides} backgroundUrl={urls.background} />
}

export const Route = createFileRoute(
  '/(main)/(students)/lessons/advanced-topics/multiple-intelligence-theory/lesson-5/',
)({
  component: LessonHomePage,
})
