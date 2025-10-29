import { createFileRoute, useNavigate, notFound } from '@tanstack/react-router'
import { Route as parentRoute } from './route'
import ContentPageSlide from '@/lib/components/activities/ContentPageSlide'

export const Route = createFileRoute(
  '/(main)/test/lessons/$course/$unit/$lesson/pages/$id',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const { course, unit, lesson, id: pageId } = Route.useParams()
  const lessonData = parentRoute.useLoaderData()
  const { urls, title, pages } = lessonData

  // Find page in pages array
  const page = pages?.find((p) => p.id === pageId)

  if (!page) {
    throw notFound()
  }

  const handleClose = () => {
    navigate({
      to: '/test/lessons/$course/$unit/$lesson',
      params: { course, unit, lesson },
    })
  }

  return (
    <ContentPageSlide
      pageData={page}
      backgroundUrl={urls.background}
      title={`${page.title || 'Page'} - ${title}`}
      onClose={handleClose}
    />
  )
}
