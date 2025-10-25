import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons'
import { App as AntApp, Button, Card, Form, Input } from 'antd'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Logo } from '@/lib/components/ui/Logo'
import { ThemeLangControl } from '@/lib/components/ui/ThemeLangControl'
import { useLang } from '@/lib/hooks/use-lang'
import { useAuth } from '@/lib/hooks/use-auth'

export const Route = createFileRoute('/(auth)/signup')({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: (search.redirect as string) || undefined,
  }),
  component: SignUpPage,
})

function SignUpPage() {
  const { message } = AntApp.useApp()
  const navigate = useNavigate()
  const { redirect } = Route.useSearch()
  const { t } = useLang()
  const { signup } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (values: { email: string; password: string }) => {
    setIsLoading(true)
    const result = await signup(
      undefined,
      undefined,
      values.email,
      values.password,
    )
    if (result.success) {
      message.success(result.message)
      navigate({ to: '/login', search: { redirect: undefined }, replace: true })
    } else {
      message.error(result.error)
    }
    setIsLoading(false)
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
          {t('Create a new account')}
        </p>
      </div>

      <Form
        name="signup"
        onFinish={handleSubmit}
        layout="vertical"
        size="large"
      >
        <Form.Item
          style={{ marginBottom: 12 }}
          label={t('Email')}
          name="email"
          rules={[
            { required: true, message: t('Please enter your email') },
            { type: 'email', message: t('Please enter a valid email') },
          ]}
        >
          <Input
            prefix={<MailOutlined />}
            placeholder={t('Enter your email')}
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

        <Form.Item
          style={{ marginBottom: 12 }}
          label={t('Confirm password')}
          name="confirmPassword"
          dependencies={['password']}
          rules={[
            { required: true, message: t('Please confirm your password') },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error(t('Passwords do not match')))
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder={t('Confirm your password')}
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 12, marginTop: 20 }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            style={{ width: '100%', height: 48 }}
          >
            {t('Sign up')}
          </Button>
        </Form.Item>
      </Form>

      <div style={{ textAlign: 'center' }}>
        <span style={{ color: '#64748b' }}>{t('Have an account?')} </span>
        <Link
          to="/login"
          search={{ redirect: redirect }}
          style={{ color: '#2563eb', fontWeight: 500, textDecoration: 'none' }}
        >
          {t('Login here')}
        </Link>
      </div>
      <div style={{ marginTop: 16 }}>
        <ThemeLangControl />
      </div>
    </Card>
  )
}
