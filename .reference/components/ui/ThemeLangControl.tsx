'use client'

import { BulbOutlined, GlobalOutlined } from '@ant-design/icons'
import { Button, Flex, Tooltip, theme } from 'antd'
import { useLang } from '@/hooks/use-lang'
import { useTheme } from '@/hooks/use-theme'

export const ThemeLangControl = () => {
  const { token } = theme.useToken()
  const { selectedTheme, toggleTheme } = useTheme()
  const { selectedLang, toggleLang, t } = useLang()
  return (
    <Flex justify="center" align="center" gap="small" style={{ width: '100%' }}>
      <Tooltip
        title={
          selectedTheme === 'dark'
            ? t('Switch to Light Mode')
            : t('Switch to Dark Mode')
        }
      >
        <Button
          type="text"
          icon={<BulbOutlined />}
          onClick={toggleTheme}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '2rem',
            height: '2rem',
            borderRadius: '6px',
            color: token.colorTextSecondary,
          }}
        />
      </Tooltip>

      <Tooltip
        title={
          selectedLang === 'vi'
            ? t('Switch to English')
            : t('Switch to Vietnamese')
        }
      >
        <Button
          type="text"
          icon={<GlobalOutlined />}
          onClick={toggleLang}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '2rem',
            height: '2rem',
            borderRadius: '6px',
            color: token.colorTextSecondary,
          }}
        />
      </Tooltip>
    </Flex>
  )
}
