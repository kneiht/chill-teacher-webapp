import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { LocalStorageKeys } from '@/lib/utils/local-storage-helpers'

export const Route = createFileRoute('/(auth)')({
  beforeLoad: () => {
    const user = localStorage.getItem(LocalStorageKeys.USER)
    if (user) {
      throw redirect({ to: '/lessons', replace: true })
    }
  },
  component: AuthLayout,
})

function AuthLayout() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
      }}
    >
      <Outlet />
    </div>
  )
}
