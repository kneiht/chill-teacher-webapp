import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(main)/(students)/lesssons/$lessonSlug')(
  {
    component: RouteComponent,
  },
)

function RouteComponent() {
  return <div>Hello "/(main)/(students)/lesssons/$lessonSlug"!</div>
}
