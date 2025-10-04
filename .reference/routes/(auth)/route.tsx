import { Flex, Layout } from 'antd'
import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)')({
  component: AuthLayout,
})

function AuthLayout() {
  return (
    <Layout>
      <Flex
        justify="center"
        vertical
        align="center"
        style={{ height: '100vh' }}
      >
        <Outlet />
      </Flex>
    </Layout>
  )
}
