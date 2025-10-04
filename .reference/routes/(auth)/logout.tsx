import { useEffect } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Spin } from 'antd'
import { useAuth } from '@/hooks/use-auth'

export const Route = createFileRoute('/(auth)/logout')({
  component: LogoutPage,
})

function LogoutPage() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    logout()
    navigate({ to: '/login', replace: true })
  }, [logout, navigate])

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#f8fafc',
      }}
    >
      <Spin size="large" />
    </div>
  )
}
