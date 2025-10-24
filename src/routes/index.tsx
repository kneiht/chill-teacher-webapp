import { createFileRoute, redirect } from '@tanstack/react-router'
import { LocalStorageKeys } from '@/lib/utils/local-storage-helpers'

const LandingPage = () => {
  return <div>Landing Page</div>
}

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    const user = localStorage.getItem(LocalStorageKeys.USER)
    if (user) {
      throw redirect({ to: '/lessons', replace: true })
    }
  },
  component: () => LandingPage,
})
