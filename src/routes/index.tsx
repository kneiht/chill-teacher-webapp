import { createFileRoute, redirect } from '@tanstack/react-router'
import { LocalStorageKeys } from '@/lib/utils/local-storage-helpers'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    const user = localStorage.getItem(LocalStorageKeys.USER)
    if (user) {
      throw redirect({ to: '/dashboard', replace: true })
    } else {
      throw redirect({ to: '/login', replace: true })
    }
  },
  component: () => null,
})
