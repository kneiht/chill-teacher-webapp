import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/(main)/(students)/lessons/advanced-topics/multiple-intelligence-theory/lesson-3/youtube-lesson',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      Hello
      "/(main)/(students)/lessons/advanced-topics/multiple-intelligence-theory/lesson-3/youtube-lesson"!
    </div>
  )
}
