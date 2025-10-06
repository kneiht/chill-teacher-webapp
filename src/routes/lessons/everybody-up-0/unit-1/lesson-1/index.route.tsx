import { createFileRoute } from '@tanstack/react-router'

import PresentationShell from '@/lib/components/presentation/PresentationShell'
import Slide1 from './-slides/Slide1'
import Slide2 from './-slides/Slide2'
import Slide3 from './-slides/Slide3'
import Slide4 from './-slides/Slide4'
import Slide5 from './-slides/Slide5'
import Slide6 from './-slides/Slide6'
import Slide7 from './-slides/Slide7'
import Slide8 from './-slides/Slide8'
import Slide9 from './-slides/Slide9'
import Slide10 from './-slides/Slide10'
import Slide11 from './-slides/Slide11'
import Slide12 from './-slides/Slide12'
import Slide13 from './-slides/Slide13'
import Slide14 from './-slides/Slide14'
import Slide15 from './-slides/Slide15'
import Slide16 from './-slides/Slide16'
import Slide17 from './-slides/Slide17'

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
