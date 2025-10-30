import { createFileRoute, Link } from '@tanstack/react-router'
import PresentationShell from '@/lib/components/presentation/PresentationShell'
import Slide from '@/lib/components/presentation/Slide'
import WoodenButton from '@/lib/components/ui/WoodenButton'
import { Route as parentRoute } from './route'
import { ACTIVITY_REGISTRY } from './$activity'

export const Route = createFileRoute(
  '/(main)/test/lessons/$course/$unit/$lesson/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const lessonData = parentRoute.useLoaderData()
  const params = Route.useParams()
  const { background, title, description, externalContent, pages, menu } =
    lessonData

  const buttonStyle =
    'w-100 text-blue-800 cursor-pointer font-bold py-4 px-2 rounded-xl text-3xl transition-transform transform hover:scale-105'

  // Helper function to get item details by type and id
  const getItemDetails = (
    type: string,
    id: string,
  ): {
    id: string
    title: string
    icon: string
    route: string
    description?: string
  } | null => {
    switch (type) {
      case 'video': {
        const video = externalContent?.videos?.find((v) => v.id === id)
        if (!video) return null
        return {
          id: `video-${video.id}`,
          title: video.title || 'Video',
          icon: '',
          route: `/test/lessons/$course/$unit/$lesson/youtube/${video.id}`,
          description: video.title,
        }
      }

      case 'googleSlide': {
        const slide = externalContent?.googleSlides?.find((s) => s.id === id)
        if (!slide) return null
        return {
          id: `slide-${slide.id}`,
          title: slide.title || 'Presentation',
          icon: '',
          route: `/test/lessons/$course/$unit/$lesson/googleslide/${slide.id}`,
          description: slide.title,
        }
      }

      case 'embedPage': {
        const embed = externalContent?.embedPages?.find((e) => e.id === id)
        if (!embed) return null
        return {
          id: `embed-${embed.id}`,
          title: embed.title || 'Interactive Page',
          icon: '',
          route: `/test/lessons/$course/$unit/$lesson/embed/${embed.id}`,
          description: embed.title,
        }
      }

      case 'page': {
        const page = pages?.find((p) => p.id === id)
        if (!page) return null
        return {
          id: `page-${page.id}`,
          title: page.title || 'Page',
          icon: '',
          route: `/test/lessons/$course/$unit/$lesson/pages/${page.id}`,
          description: page.subtitle || page.title,
        }
      }

      case 'activity': {
        // Get metadata from registry
        const activityMeta = ACTIVITY_REGISTRY[id]
        if (!activityMeta) return null
        return {
          id: id,
          title: activityMeta.title,
          icon: activityMeta.icon,
          route: `/test/lessons/$course/$unit/$lesson/${id}`,
          description: activityMeta.description,
        }
      }

      default:
        return null
    }
  }

  // Build activities list from menu
  const allActivities: Array<{
    id: string
    title: string
    icon: string
    route: string
    description?: string
  }> = []

  menu.forEach((menuItem) => {
    const item = getItemDetails(menuItem.type, menuItem.id)
    if (item) {
      allActivities.push(item)
    }
  })

  function LessonHomepageSlide({ isActive }: { isActive: boolean }) {
    return (
      <div className="h-[98%] overflow-auto">
        <Slide isActive={isActive}>
          <div className="flex flex-col items-center justify-start h-full text-center">
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-4 mt-6 text-center leading-tight">
              {title}
              <br />
              {description}
            </h1>

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
  return <PresentationShell slides={slides} backgroundUrl={background} />
}
