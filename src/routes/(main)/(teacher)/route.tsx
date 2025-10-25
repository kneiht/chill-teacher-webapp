import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { LocalStorageKeys } from '@/lib/utils/local-storage-helpers'

export const Route = createFileRoute('/(main)/(teacher)')({
  beforeLoad: () => {
    const user = localStorage.getItem(LocalStorageKeys.USER)
    if (user) {
      const userData = JSON.parse(user)
      const userRole = userData.role?.toLowerCase()
      if (userRole === 'student') {
        throw redirect({ to: '/dashboard', replace: true })
      }
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <Outlet />
    </div>
  )
}
