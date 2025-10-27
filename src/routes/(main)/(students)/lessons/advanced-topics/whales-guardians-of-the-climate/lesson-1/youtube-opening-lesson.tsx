import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/(main)/(students)/lessons/advanced-topics/whales-guardians-of-the-climate/lesson-1/youtube-opening-lesson',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      Hello
      "/(main)/(students)/lessons/advanced-topics/whales-guardians-of-the-climate/lesson-1/youtube-opening-lesson"!
    </div>
  )
}
