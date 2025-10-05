// UI components
import { Typography } from 'antd'

// Router
import { createFileRoute } from '@tanstack/react-router'

// Hooks
import { useLang } from '@/lib/hooks/use-lang'

const { Title, Text } = Typography
const Profile: React.FC = () => {
  const { t } = useLang()
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>{t('Profile')}</Title>
        <Text type="secondary">{t('This is the profile page!')}</Text>
      </div>
    </div>
  )
}

// Export the route
export const Route = createFileRoute('/(main)/profile')({
  component: Profile,
})
