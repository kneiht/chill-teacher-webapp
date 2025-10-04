// UI components
import { Typography } from 'antd'

// Router
import { createFileRoute } from '@tanstack/react-router'

// Hooks
import { useLang } from '@/lib/hooks/use-lang'

const { Title, Text } = Typography
const Dashboard: React.FC = () => {
  const { t } = useLang()
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>{t('Settings')}</Title>
        <Text type="secondary">{t('This is the settings page!')}</Text>
      </div>
    </div>
  )
}

// Export the route

export const Route = createFileRoute('/(main)/settings')({
  component: Dashboard,
})
