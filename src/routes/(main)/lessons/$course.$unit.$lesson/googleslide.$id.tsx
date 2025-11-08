import { createFileRoute, useNavigate, notFound } from '@tanstack/react-router'
import { Route as parentRoute } from './route'
import GoogleSlide from '@/lib/components/activities/GoogleSlide'

export const Route = createFileRoute(
  '/(main)/lessons/$course/$unit/$lesson/googleslide/$id',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const { course, unit, lesson, id: slideId } = Route.useParams()
  const lessonData = parentRoute.useLoaderData()
  const { background, title, externalContent } = lessonData

  // Find slide in externalContent
  const slide = externalContent?.googleSlides?.find(
    (s: any) => s.id === slideId,
  )

  if (!slide) {
    throw notFound()
  }

  const handleClose = () => {
    navigate({
      to: '/lessons/$course/$unit/$lesson',
      params: { course, unit, lesson },
    })
  }

  return (
    <GoogleSlide
      url={slide.url}
      title={`${slide.title || 'Presentation'} - ${title}`}
      backgroundUrl={background}
      onClose={handleClose}
    />
  )
}
