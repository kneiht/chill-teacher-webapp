import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/(main)/(teacher)')({
  component: RouteComponent,
})

// TODO: If user is student, redirect to /dashboard
function RouteComponent() {
  return (
    <div>
      <Outlet />
    </div>
  )
}
