'use client'

// Import Icons from Ant Design
import {
  BarChartOutlined,
  BookOutlined,
  CalendarOutlined,
  DashboardOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ReadOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons'

// Import Components from Ant Design
import {
  Avatar,
  Button,
  Divider,
  Dropdown,
  Flex,
  Layout,
  Menu,
  Typography,
  theme,
} from 'antd'

// Import React hooks and Tanstack Router
import { useEffect, useState } from 'react'
import {
  Link,
  Outlet,
  createFileRoute,
  useLocation,
  useNavigate,
} from '@tanstack/react-router'
import type { MenuProps } from 'antd'

// Import Components
import { Logo } from '@/components/ui/Logo'
import { ThemeLangControl } from '@/components/ui/ThemeLangControl'

// Import contexts
import { useAuth } from '@/hooks/use-auth'
import { useLang } from '@/hooks/use-lang'

// Destructure Layout components from Ant Design
const { Header, Sider, Content } = Layout
const { Text } = Typography

// Define the TriggerButton component
const TriggerButton = ({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
}) => {
  return (
    <Button
      style={{
        fontSize: '1.2rem',
        width: '100%',
        height: '2rem',
      }}
      type="text"
      icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      onClick={() => setCollapsed(!collapsed)}
    />
  )
}

export const Route = createFileRoute('/(admin)')({
  component: MainLayout,
})

// Define the MainLayout component
function MainLayout() {
  const [collapsed, setCollapsed] = useState(true)
  const { t } = useLang()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { token } = theme.useToken()
  const { user, logout } = useAuth()

  if (!user) {
    navigate({ to: '/login' })
  }

  // Define the menu items
  const menuItems: MenuProps['items'] = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/dashboard">{t('Dashboard')}</Link>,
    },
    {
      key: '/students',
      icon: <UserOutlined />,
      label: <Link to="/students">{t('Students')}</Link>,
    },
    {
      key: '/teachers',
      icon: <TeamOutlined />,
      label: <Link to="/teachers">{t('Teachers')}</Link>,
    },
    {
      key: '/classes',
      icon: <BookOutlined />,
      label: <Link to="/classes">{t('Classes')}</Link>,
    },
    {
      key: '/classroom',
      icon: <ReadOutlined />,
      label: <Link to="/classroom">{t('Classroom')}</Link>,
    },
    {
      key: '/attendance',
      icon: <CalendarOutlined />,
      label: <Link to="/attendance">{t('Attendance')}</Link>,
    },
    {
      key: '/reports',
      icon: <BarChartOutlined />,
      label: <Link to="/reports">{t('Reports')}</Link>,
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: <Link to="/settings">{t('Settings')}</Link>,
    },
  ]

  // Define the user menu items
  const userMenuItems: MenuProps['items'] = [
    {
      key: '/profile',
      icon: <UserOutlined />,
      label: t('Profile'),
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: t('Settings'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: t('Logout'),
    },
  ]

  // Handle menu item clicks
  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      logout()
      navigate({ to: '/login' })
    } else {
      navigate({ to: key })
    }
  }

  // Return the MainLayout component
  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Header */}
      <Header
        style={{
          height: '3rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: token.boxShadow,
          zIndex: 1,
          padding: '0 1rem',
        }}
      >
        {/* Left side - Logo */}
        <Logo />
        {/* Right side - Controls and User */}
        <Flex align="center" gap="middle">
          {/* Theme and Language Controls */}
          <ThemeLangControl />

          {/* Divider */}
          <Divider type="vertical" style={{ height: '1.5rem', margin: '0' }} />

          {/* User Menu */}
          <Dropdown
            menu={{ items: userMenuItems, onClick: handleMenuClick }}
            placement="bottomRight"
            trigger={['click']}
          >
            <Flex
              align="center"
              gap="small"
              className="cursor-pointer"
              style={{
                padding: '0.25rem 0.5rem',
                borderRadius: '6px',
                transition: 'background-color 0.2s',
              }}
            >
              <Avatar
                icon={<UserOutlined />}
                size="small"
                style={{ backgroundColor: token.colorPrimary }}
              />
              <Text
                style={{
                  fontSize: '0.875rem',
                  color: token.colorText,
                  whiteSpace: 'nowrap',
                }}
              >
                {user?.name}
              </Text>
            </Flex>
          </Dropdown>
        </Flex>
      </Header>

      {/* Sidebar and Content */}
      <Layout style={{ margin: '0.25rem 0.25rem' }}>
        {/* Content */}
        <Content
          style={{
            padding: '1rem',
            height: 'calc(100vh - 4rem)',
            overflow: 'auto',
          }}
          className="custom-scrollbar"
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
