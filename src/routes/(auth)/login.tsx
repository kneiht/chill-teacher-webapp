import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { App as AntApp, Button, Card, Form, Input } from 'antd'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { Logo } from '@/lib/components/ui/Logo'
import { ThemeLangControl } from '@/lib/components/ui/ThemeLangControl'
import { useLang } from '@/lib/hooks/use-lang'
import { useAuth } from '@/lib/hooks/use-auth'

export const Route = createFileRoute('/(auth)/login')({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: (search.redirect as string) || undefined,
  }),
  component: LoginPage,
})

function LoginPage() {
  const { message } = AntApp.useApp()
  const navigate = useNavigate()
  const { redirect } = Route.useSearch()
  const { t } = useLang()
  const { login, isLoading } = useAuth()

  const handleSubmit = async (values: { login: string; password: string }) => {
    const result = await login(values.login, values.password)
    if (result.success) {
      message.success(result.message)
      navigate({ to: redirect || '/dashboard' })
    } else {
      message.error(result.error)
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
      <div style={{ textAlign: 'center', marginBottom: 10 }}>
        <Logo />
        <p style={{ color: '#64748b', marginTop: 6 }}>
          {t('Login to your account')}
        </p>
      </div>

      <Form name="login" onFinish={handleSubmit} layout="vertical" size="large">
        <Form.Item
          style={{ marginBottom: 12 }}
          label={t('Username or Email')}
          name="login"
          rules={[
            {
              required: true,
              message: t('Please enter your username or email'),
            },
          ]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder={t('Enter your username or email')}
          />
        </Form.Item>

        <Form.Item
          style={{ marginBottom: 12 }}
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

        <Form.Item style={{ marginBottom: 12, marginTop: 20 }}>
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
          search={{ redirect: redirect }}
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
