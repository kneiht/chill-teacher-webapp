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
  const { urls, title, description, activities, externalContent, pages } =
    lessonData

  const buttonStyle =
    'w-100 text-blue-800 cursor-pointer font-bold py-4 px-2 rounded-xl text-3xl transition-transform transform hover:scale-105'

  // Combine all activities with external content
  const allActivities: Array<{
    id: string
    title: string
    icon: string
    route: string
    description?: string
  }> = []

  // Add Youtube videos with dedicated routes
  if (externalContent?.videos) {
    externalContent.videos.forEach((video) => {
      allActivities.push({
        id: `video-${video.id}`,
        title: video.title || 'Video',
        icon: '🎥',
        route: `/test/lessons/$course/$unit/$lesson/youtube/${video.id}`,
        description: video.title,
      })
    })
  }

  // Add Google Slides with dedicated routes
  if (externalContent?.googleSlides) {
    externalContent.googleSlides.forEach((slide) => {
      allActivities.push({
        id: `slide-${slide.id}`,
        title: slide.title || 'Presentation',
        icon: '📊',
        route: `/test/lessons/$course/$unit/$lesson/googleslide/${slide.id}`,
        description: slide.title,
      })
    })
  }

  // Add Pages with dedicated routes
  if (pages) {
    pages.forEach((page) => {
      allActivities.push({
        id: `page-${page.id}`,
        title: page.title || 'Page',
        icon: '📄',
        route: `/test/lessons/$course/$unit/$lesson/pages/${page.id}`,
        description: page.subtitle || page.title,
      })
    })
  }

  // Add regular activities with activity route
  activities.forEach((activity) => {
    allActivities.push({
      id: activity.id,
      title: activity.title,
      icon: activity.icon,
      route: `/test/lessons/$course/$unit/$lesson/$activity`,
      description: activity.description,
    })
  })

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
              {allActivities.map((item) => (
                <Link
                  key={item.id}
                  to={item.route}
                  params={
                    item.route.includes('$activity')
                      ? { ...params, activity: item.id }
                      : params
                  }
                >
                  <WoodenButton
                    className={buttonStyle}
                    title={item.description}
                  >
                    {item.icon} {item.title}
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
