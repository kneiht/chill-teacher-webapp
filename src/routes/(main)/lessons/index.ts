import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(main)/lessons/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(main)/lessons/"!</div>
}
