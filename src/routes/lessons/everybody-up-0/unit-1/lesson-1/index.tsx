import { createFileRoute } from '@tanstack/react-router'

import PresentationShell from '@/lib/components/presentation/PresentationShell'
import {
  Slide1,
  Slide2,
  Slide3,
  Slide4,
  Slide5,
  Slide6,
  Slide7,
  Slide8,
  Slide9,
  Slide10,
  Slide11,
  Slide12,
  Slide13,
  Slide14,
  Slide15,
  Slide16,
  Slide17,
} from './-slides'

import bg from './-assets/bg.png'

const PresentContinuousLesson: React.FC = () => {
  const slides = [
    Slide1,
    Slide2,
    Slide3,
    Slide4,
    Slide5,
    Slide6,
    Slide7,
    Slide8,
    Slide9,
    Slide10,
    Slide11,
    Slide12,
    Slide13,
    Slide14,
    Slide15,
    Slide16,
    Slide17,
  ]
  return <PresentationShell slides={slides} backgroundUrl={bg} />
}

export default PresentContinuousLesson

export const Route = createFileRoute(
  '/lessons/everybody-up-0/unit-1/lesson-1/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <PresentContinuousLesson />
}
