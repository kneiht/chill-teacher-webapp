import { createFileRoute } from '@tanstack/react-router'
import Presentation from './presentation'

export const Route = createFileRoute(
  '/lessons/everybody-up-0/unit-1/presentation',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <Presentation />
}
