import { createFileRoute, useNavigate, notFound } from '@tanstack/react-router'
import { Route as parentRoute } from './route'
import EmbedPageSlide from '@/lib/components/activities/EmbedPageSlide'

export const Route = createFileRoute(
  '/(main)/test/lessons/$course/$unit/$lesson/embed/$id',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const { course, unit, lesson, id: embedId } = Route.useParams()
  const lessonData = parentRoute.useLoaderData()
  const { background, title, externalContent } = lessonData

  // Find embed page in externalContent
  const embedPage = externalContent?.embedPages?.find((e) => e.id === embedId)

  if (!embedPage) {
    throw notFound()
  }

  const handleClose = () => {
    navigate({
      to: '/test/lessons/$course/$unit/$lesson',
      params: { course, unit, lesson },
    })
  }

  return (
    <EmbedPageSlide
      url={embedPage.url}
      title={`${embedPage.title || 'Embedded Page'} - ${title}`}
      backgroundUrl={background}
      onClose={handleClose}
    />
  )
}
