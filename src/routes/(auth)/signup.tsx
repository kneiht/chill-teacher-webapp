import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons'
import { App as AntApp, Button, Card, Form, Input } from 'antd'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Logo } from '@/lib/components/ui/Logo'
import { ThemeLangControl } from '@/lib/components/ui/ThemeLangControl'
import { useLang } from '@/lib/hooks/use-lang'
import { useAuth } from '@/lib/hooks/use-auth'

export const Route = createFileRoute('/(auth)/signup')({
  component: SignUpPage,
})

function SignUpPage() {
  const { message } = AntApp.useApp()
  const navigate = useNavigate()
  const { t } = useLang()
  const { signup } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (values: {
    name: string
    email: string
    password: string
  }) => {
    setIsLoading(true)
    const result = await signup(values.name, values.email, values.password)
    if (result.success) {
      message.success(result.message)
      navigate({ to: '/login', replace: true })
    } else {
      message.error(result.message)
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
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <Logo />
        <p style={{ color: '#64748b', marginTop: 8 }}>
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
          label={t('User name')}
          name="name"
          rules={[
            { required: true, message: t('Please enter your name') },
            { min: 2, message: t('Name must be at least 2 characters') },
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder={t('Enter your name')} />
        </Form.Item>

        <Form.Item
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

        <Form.Item>
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
