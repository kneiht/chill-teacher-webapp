import { createFileRoute } from '@tanstack/react-router'
import PresentContinuousLesson from './PresentContinuousLesson'

export const Route = createFileRoute('/lessons/everybody-up-0/unit-1')({
  component: RouteComponent,
})

function RouteComponent() {
  return <PresentContinuousLesson />
}
