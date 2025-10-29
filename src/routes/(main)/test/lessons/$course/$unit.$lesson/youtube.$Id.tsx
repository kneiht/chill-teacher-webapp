import { createFileRoute, useNavigate, notFound } from '@tanstack/react-router'
import { Route as parentRoute } from './route'
import YoutubeSlide from '@/lib/components/activities/YoutubeSlide'

export const Route = createFileRoute(
  '/(main)/test/lessons/$course/$unit/$lesson/youtube/$Id',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const { Id: videoId, course, unit, lesson } = Route.useParams()
  const lessonData = parentRoute.useLoaderData()
  const { urls, title, externalContent } = lessonData

  // Find video in externalContent
  const video = externalContent?.videos?.find((v) => v.id === videoId)

  if (!video) {
    throw notFound()
  }

  const handleClose = () => {
    navigate({
      to: '/test/lessons/$course/$unit/$lesson',
      params: { course, unit, lesson },
    })
  }

  return (
    <YoutubeSlide
      url={video.url}
      title={`${video.title || 'Video'} - ${title}`}
      backgroundUrl={urls.background}
      onClose={handleClose}
    />
  )
}
