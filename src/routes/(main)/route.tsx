// Import Icons from Ant Design
import {
  BarChartOutlined,
  BookOutlined,
  CalendarOutlined,
  DashboardOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuOutlined,
  MenuUnfoldOutlined,
  ReadOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons'

// Import Components from Ant Design
import type { MenuProps } from 'antd'
import {
  Avatar,
  Button,
  Divider,
  Drawer,
  Dropdown,
  Flex,
  Layout,
  Menu,
  Typography,
  theme,
} from 'antd'

// Import React hooks
import { useState } from 'react'

// Import Tanstack Router
import {
  Link,
  Outlet,
  createFileRoute,
  useLocation,
  useNavigate,
  redirect,
} from '@tanstack/react-router'

// Import local storage helpers
import { LocalStorageKeys } from '@/lib/utils/local-storage-helpers'

// Import Components
import { Logo } from '@/lib/components/ui/Logo'
import { ThemeLangControl } from '@/lib/components/ui/ThemeLangControl'

// Import contexts
import { useAuth } from '@/lib/hooks/use-auth'
import { useLang } from '@/lib/hooks/use-lang'

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

// Define the MainLayout component
function MainLayout() {
  const [collapsed, setCollapsed] = useState(true)
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
  const { t } = useLang()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { token } = theme.useToken()
  const { user, logout } = useAuth()

  const getMenuItems = (): MenuProps['items'] => {
    const userRole = user?.role?.toLowerCase()

    const allMenuItems: MenuProps['items'] = [
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

    if (userRole === 'student') {
      return [
        {
          key: '/dashboard',
          icon: <DashboardOutlined />,
          label: <Link to="/dashboard">{t('Dashboard')}</Link>,
        },
        // {
        //   key: '/lessons',
        //   icon: <ReadOutlined />,
        //   label: <Link to="/lessons/">{t('Lessons')}</Link>,
        // },
      ]
    }

    return allMenuItems
  }

  const menuItems = getMenuItems()

  // Define the user menu itemss
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
      navigate({ to: '/login', search: { redirect: undefined } })
    } else {
      navigate({ to: key })
    }
  }

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
        {/* Left side - Mobile Menu Button + Logo */}
        <Flex align="center" gap="small">
          {/* Mobile Menu Button */}
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setMobileDrawerOpen(true)}
            style={{
              fontSize: '1.2rem',
              display: 'none',
            }}
            className="mobile-menu-button"
          />
          <Logo />
        </Flex>

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
                {user?.display_name}
              </Text>
            </Flex>
          </Dropdown>
        </Flex>
      </Header>

      {/* Sidebar and Content */}
      <Layout style={{ margin: '0.25rem 0.25rem' }}>
        {/* Sidebar */}
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          breakpoint="lg"
          width={200}
          style={{ boxShadow: token.boxShadow, borderRadius: '10px' }}
          className="desktop-sidebar"
        >
          <Flex vertical style={{ height: '100%' }}>
            <Link to="/schools" style={{ textDecoration: 'none' }}>
              <Flex
                vertical
                justify="space-between"
                align="center"
                style={{ padding: '1rem' }}
              >
                <Avatar size={60} src="/logo/logo192.png" />
                <Text
                  strong
                  style={{
                    fontSize: '1rem',
                    whiteSpace: 'nowrap',
                    opacity: collapsed ? 0 : 1,
                    transform: collapsed
                      ? 'translateY(-10px)'
                      : 'translateY(0)',
                    transition: 'opacity 0.3s ease, transform 0.3s ease',
                    height: collapsed ? 0 : 'auto',
                    overflow: 'hidden',
                    margin: collapsed ? 0 : '0.5rem 0',
                  }}
                >
                  School Name
                </Text>
                <Divider style={{ margin: '0.5rem' }} />
              </Flex>
            </Link>

            <Flex vertical justify="space-between" style={{ height: '100%' }}>
              <Menu
                style={{
                  border: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
                mode="inline"
                selectedKeys={[pathname]}
                items={menuItems}
                // onClick={({ key }) => router.push(key)}
              />
              <div style={{ padding: '0.5rem' }}>
                <TriggerButton
                  collapsed={collapsed}
                  setCollapsed={setCollapsed}
                />
              </div>
            </Flex>
          </Flex>
        </Sider>

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

      {/* Mobile Drawer Menu */}
      <Drawer
        title={
          <Flex align="center" justify="center" vertical gap="small">
            <Avatar size={60} src="/logo/logo192.png" />
            <Text strong>School Name</Text>
          </Flex>
        }
        placement="left"
        onClose={() => setMobileDrawerOpen(false)}
        open={mobileDrawerOpen}
        width={280}
        styles={{
          body: { padding: 0 },
        }}
      >
        <Menu
          mode="inline"
          selectedKeys={[pathname]}
          items={menuItems}
          onClick={({ key }) => {
            if (key.startsWith('/')) {
              navigate({ to: key })
              setMobileDrawerOpen(false)
            }
          }}
          style={{
            border: 'none',
          }}
        />
      </Drawer>
    </Layout>
  )
}

// Define the EscapeMainLayout component
function EscapeMainLayout() {
  return <Outlet />
}

// Define the Layout Selector
function LayoutSelector() {
  const { pathname } = useLocation()
  const escapedRoutes = [
    '/lessons/everybody-up-0',
    '/lessons/advanced-topics',
    '/test/lessons/demo-course/demo-unit',
  ]
  const isEscapedRoute = escapedRoutes.some(
    // Check if the pathname starts with an escaped route and has another path segment after it
    (route) => pathname.startsWith(route) && pathname.length - route.length > 1,
  )
  return isEscapedRoute ? <EscapeMainLayout /> : <MainLayout />
}

export const Route = createFileRoute('/(main)')({
  beforeLoad: (ctx) => {
    const user = localStorage.getItem(LocalStorageKeys.USER)
    const refreshToken = localStorage.getItem('refresh_token')
    if (!user || !refreshToken) {
      throw redirect({
        to: '/login',
        search: { redirect: ctx.location.pathname },
        replace: true,
      })
    }
  },
  component: LayoutSelector,
})
