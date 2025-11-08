import { createFileRoute, useNavigate, notFound } from '@tanstack/react-router'
import { Route as parentRoute } from './route'
import YoutubeSlide from '@/lib/components/activities/YoutubeSlide'

export const Route = createFileRoute(
  '/(main)/lessons/$course/$unit/$lesson/youtube/$id',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const { course, unit, lesson, id: videoId } = Route.useParams()
  const lessonData = parentRoute.useLoaderData()
  const { background, title, externalContent } = lessonData

  // Find video in externalContent
  const video = externalContent?.videos?.find((v: any) => v.id === videoId)

  if (!video) {
    throw notFound()
  }

  const handleClose = () => {
    navigate({
      to: '/lessons/$course/$unit/$lesson',
      params: { course, unit, lesson },
    })
  }

  return (
    <YoutubeSlide
      url={video.url}
      title={`${video.title || 'Video'} - ${title}`}
      backgroundUrl={background}
      onClose={handleClose}
    />
  )
}
