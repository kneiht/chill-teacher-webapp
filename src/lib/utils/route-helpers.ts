import { LocalStorageKeys, getFromLocalStorage } from './local-storage-helpers'
import type { AuthSuccessData } from '@/lib/fetches/auth.fetch'

/**
 * Get the default route based on user role
 * - Student: /lessons
 * - Admin/Teacher: /dashboard
 */
export function getDefaultRoute(): string {
  const user = getFromLocalStorage<AuthSuccessData['user']>(
    LocalStorageKeys.USER,
  )

  if (!user) {
    return '/dashboard'
  }

  const userRole = user.role?.toLowerCase()

  if (userRole === 'student') {
    return '/lessons'
  }

  return '/dashboard'
}
