import { createFileRoute, useNavigate, notFound } from '@tanstack/react-router'
import { Route as parentRoute } from './route'
import GoogleSlide from '@/lib/components/activities/GoogleSlide'

export const Route = createFileRoute(
  '/(main)/test/lessons/$course/$unit/$lesson/googleslide/$Id',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const { Id: slideId, course, unit, lesson } = Route.useParams()
  const lessonData = parentRoute.useLoaderData()
  const { urls, title, externalContent } = lessonData

  // Find slide in externalContent
  const slide = externalContent?.googleSlides?.find((s) => s.id === slideId)

  if (!slide) {
    throw notFound()
  }

  const handleClose = () => {
    navigate({
      to: '/test/lessons/$course/$unit/$lesson',
      params: { course, unit, lesson },
    })
  }

  return (
    <GoogleSlide
      url={slide.url}
      title={`${slide.title || 'Presentation'} - ${title}`}
      backgroundUrl={urls.background}
      onClose={handleClose}
    />
  )
}
