import { createFileRoute } from '@tanstack/react-router'
import JsonSlide from '../lib/components/activities/JsonSlide'
import demoSlidesData from '../mock-data/demo-slides.json'

export const Route = createFileRoute('/demo')({
  component: DemoSlides,
})

function DemoSlides() {
  return <JsonSlide data={demoSlidesData as any} />
}
