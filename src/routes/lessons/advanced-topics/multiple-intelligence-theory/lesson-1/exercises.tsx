import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/lessons/advanced-topics/multiple-intelligence-theory/lesson-1/exercises',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      Hello
      "/lessons/advanced-topics/multiple-intelligence-theory/lesson-1/exercises"!
    </div>
  )
}
