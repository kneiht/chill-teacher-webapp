import { createFileRoute, Link } from '@tanstack/react-router'
import PresentationShell from '@/lib/components/presentation/PresentationShell'
import Slide from '@/lib/components/presentation/Slide'
import WoodenButton from '@/lib/components/ui/WoodenButton'
import { Route as parentRoute } from './route'

interface Activity {
  id: string
  title: string
  icon: string
  type: string
  description?: string
}

export const Route = createFileRoute(
  '/(main)/test/lessons/$course/$unit/$lesson/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const lessonData = parentRoute.useLoaderData()
  const params = Route.useParams()
  const { urls, title, description, activities } = lessonData

  const buttonStyle =
    'w-100 text-blue-800 cursor-pointer font-bold py-4 px-2 rounded-xl text-3xl transition-transform transform hover:scale-105'

  function LessonHomepageSlide({ isActive }: { isActive: boolean }) {
    return (
      <div className="h-[98%] overflow-auto">
        <Slide isActive={isActive}>
          <div className="flex flex-col items-center justify-start h-full text-center">
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-4 mt-6 text-center leading-tight">
              {title}
            </h1>
            <p className="text-2xl text-gray-700 mb-8">{description}</p>

            <div className="grid grid-cols-2 gap-x-20 gap-y-7 max-w-4xl">
              {activities.map((activity) => (
                <Link
                  key={activity.id}
                  to="/test/lessons/$course/$unit/$lesson/$activity"
                  params={{ ...params, activity: activity.id }}
                >
                  <WoodenButton
                    className={buttonStyle}
                    title={activity.description}
                  >
                    {activity.icon} {activity.title}
                  </WoodenButton>
                </Link>
              ))}
            </div>
          </div>
        </Slide>
      </div>
    )
  }

  const slides = [LessonHomepageSlide]
  return <PresentationShell slides={slides} backgroundUrl={urls.background} />
}
