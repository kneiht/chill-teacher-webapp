import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { App as AntApp, Button, Card, Form, Input } from 'antd'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { Logo } from '@/lib/components/ui/Logo'
import { ThemeLangControl } from '@/lib/components/ui/ThemeLangControl'
import { useLang } from '@/lib/hooks/use-lang'
import { useAuth } from '@/lib/hooks/use-auth'

export const Route = createFileRoute('/(auth)/login')({
  component: LoginPage,
})

function LoginPage() {
  const { message } = AntApp.useApp()
  const navigate = useNavigate()
  // const redirect = Route.useSearch()
  const { t } = useLang()
  const { login, isLoading, isLoggedIn } = useAuth()

  console.log(isLoggedIn)
  if (isLoggedIn) {
    navigate({ to: '/dashboard' })
  }

  const handleSubmit = async (values: { email: string; password: string }) => {
    const result = await login(values.email, values.password)
    if (result.success) {
      message.success(result.message)
      navigate({ to: '/dashboard' })
    } else {
      message.error(result.message)
    }
  }

  return (
    <Card
      style={{
        width: '100%',
        maxWidth: 400,
        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <Logo />
        <p style={{ color: '#64748b', marginTop: 8 }}>
          {t('Login to your account')}
        </p>
      </div>

      <Form name="login" onFinish={handleSubmit} layout="vertical" size="large">
        <Form.Item
          label={t('Email')}
          name="email"
          rules={[
            { required: true, message: t('Please enter your email') },
            { type: 'email', message: t('Please enter a valid email') },
          ]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder={t('Enter your email')}
          />
        </Form.Item>

        <Form.Item
          label={t('Password')}
          name="password"
          rules={[
            { required: true, message: t('Please enter your password') },
            { min: 6, message: t('Password must be at least 6 characters') },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder={t('Enter your password')}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            style={{
              width: '100%',
              height: 48,
            }}
          >
            {t('Login')}
          </Button>
        </Form.Item>
      </Form>

      <div style={{ textAlign: 'center' }}>
        <span style={{ color: '#64748b' /* gray-600 */ }}>
          {t("Don't have an account?")}{' '}
        </span>
        <Link
          to="/signup"
          style={{
            color: '#3b82f6', // blue-600
            fontWeight: 500,
            textDecoration: 'none',
          }}
        >
          {t('Sign up here')}
        </Link>
      </div>
      <div style={{ marginTop: 16 }}>
        <ThemeLangControl />
      </div>
    </Card>
  )
}
