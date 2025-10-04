import { App as AntApp, ConfigProvider, theme } from 'antd'
import { useEffect, useState } from 'react'
import { useTheme } from '@/hooks/use-theme'
import { Theme } from '@/stores/theme.store'

// Modern Light Theme Configuration
const themeLightConfig = {
  token: {
    // Font
    fontFamily: 'Inter, sans-serif',

    // Primary Colors
    colorPrimary: '#3b82f6', // Modern blue
    colorPrimaryHover: '#2563eb',
    colorPrimaryActive: '#1d4ed8',
    colorPrimaryBg: '#eff6ff',
    colorPrimaryBgHover: '#dbeafe',
    colorPrimaryBorder: '#bfdbfe',
    colorPrimaryBorderHover: '#93c5fd',

    // Background Colors
    colorBgContainer: '#ffffff',
    colorBgElevated: '#ffffff',
    colorBgLayout: '#f8fafc',
    colorBgSpotlight: '#ffffff',
    colorBgMask: 'rgba(0, 0, 0, 0.45)',

    // Text Colors
    colorText: '#1e293b',
    colorTextSecondary: '#64748b',
    colorTextTertiary: '#94a3b8',
    colorTextQuaternary: '#cbd5e1',
    colorTextPlaceholder: '#94a3b8',

    // Border Colors
    colorBorder: '#e2e8f0',
    colorBorderSecondary: '#f1f5f9',
    colorBorderBg: '#ffffff',

    // Success, Warning, Error Colors
    colorSuccess: '#10b981',
    colorSuccessBg: '#ecfdf5',
    colorSuccessBorder: '#a7f3d0',
    colorWarning: '#f59e0b',
    colorWarningBg: '#fffbeb',
    colorWarningBorder: '#fcd34d',
    colorError: '#ef4444',
    colorErrorBg: '#fef2f2',
    colorErrorBorder: '#fca5a5',
    colorInfo: '#3b82f6',
    colorInfoBg: '#eff6ff',
    colorInfoBorder: '#93c5fd',

    // Border Radius
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusXL: 16,
    borderRadiusSM: 6,
    borderRadiusXS: 4,

    // Shadows
    boxShadow:
      '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    boxShadowSecondary:
      '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    boxShadowTertiary:
      '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  },
  algorithm: [theme.defaultAlgorithm],
  components: {
    Layout: {
      headerBg: '#ffffff',
      headerColor: '#1e293b',
      headerHeight: 64,
      headerPaddingInline: 24,
      siderBg: '#ffffff',
      siderBorderColor: '#e2e8f0',
      bodyBg: '#f8fafc',
      footerBg: '#ffffff',
      footerPadding: '24px 50px',
    },
    Menu: {
      itemBg: 'transparent',
      itemSelectedBg: '#eff6ff',
      itemHoverBg: '#f8fafc',
      itemActiveBg: '#eff6ff',
      itemSelectedColor: '#3b82f6',
      itemColor: '#64748b',
      itemHoverColor: '#1e293b',
      itemHeight: 40,
      itemMarginInline: 8,
      itemBorderRadius: 8,
      itemPaddingInline: 16,
      subMenuItemBg: 'transparent',
      groupTitleColor: '#94a3b8',
      groupTitleFontSize: 12,
      groupTitleLineHeight: 1.5,
    },
    Button: {
      borderRadius: 8,
      fontWeight: 500,
      controlHeight: 36,
      controlHeightLG: 44,
      controlHeightSM: 28,
      paddingInline: 16,
      paddingInlineLG: 20,
      paddingInlineSM: 12,
    },
    Card: {
      borderRadius: 16,
      borderColor: '#e2e8f0',
      headerBg: '#ffffff',
      headerFontSize: 16,
      headerFontWeight: 600,
      bodyBg: '#ffffff',
      boxShadow:
        '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    },
    Input: {
      borderRadius: 8,
      borderColor: '#e2e8f0',
      borderColorHover: '#cbd5e1',
      borderColorFocus: '#3b82f6',
      controlHeight: 40,
      controlHeightLG: 48,
      controlHeightSM: 32,
      paddingInline: 12,
      paddingInlineLG: 16,
      paddingInlineSM: 8,
      activeBorderColor: '#3b82f6',
      hoverBorderColor: '#cbd5e1',
    },
    Table: {
      borderRadius: 12,
      headerBg: '#f8fafc',
      headerColor: '#1e293b',
      headerFontWeight: 600,
      rowHoverBg: '#f8fafc',
      borderColor: '#e2e8f0',
    },
    Avatar: {
      borderRadius: 8,
      colorBgContainer: '#e2e8f0',
    },
    Dropdown: {
      borderRadius: 12,
      controlItemBgHover: '#f8fafc',
      controlItemBgActive: '#eff6ff',
      boxShadow:
        '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    },
    Tooltip: {
      borderRadius: 8,
      colorBgSpotlight: '#1e293b',
      colorTextLightSolid: '#ffffff',
    },
    Divider: {
      colorSplit: '#e2e8f0',
    },
  },
}

// Modern Dark Theme Configuration
const themeDarkConfig = {
  token: {
    // Font
    fontFamily: 'Inter, sans-serif',

    // Primary Colors
    colorPrimary: '#60a5fa', // Lighter blue for dark mode
    colorPrimaryHover: '#93c5fd',
    colorPrimaryActive: '#bfdbfe',
    colorPrimaryBg: '#1e3a8a',
    colorPrimaryBgHover: '#1e40af',
    colorPrimaryBorder: '#3b82f6',
    colorPrimaryBorderHover: '#60a5fa',

    // Background Colors
    colorBgContainer: '#1e293b',
    colorBgElevated: '#334155',
    colorBgLayout: '#0f172a',
    colorBgSpotlight: '#334155',
    colorBgMask: 'rgba(0, 0, 0, 0.65)',

    // Text Colors
    colorText: '#f1f5f9',
    colorTextSecondary: '#cbd5e1',
    colorTextTertiary: '#94a3b8',
    colorTextQuaternary: '#64748b',
    colorTextPlaceholder: '#64748b',

    // Border Colors
    colorBorder: '#475569',
    colorBorderSecondary: '#334155',
    colorBorderBg: '#1e293b',

    // Success, Warning, Error Colors
    colorSuccess: '#34d399',
    colorSuccessBg: '#064e3b',
    colorSuccessBorder: '#059669',
    colorWarning: '#fbbf24',
    colorWarningBg: '#78350f',
    colorWarningBorder: '#d97706',
    colorError: '#f87171',
    colorErrorBg: '#7f1d1d',
    colorErrorBorder: '#dc2626',
    colorInfo: '#60a5fa',
    colorInfoBg: '#1e3a8a',
    colorInfoBorder: '#2563eb',

    // Border Radius
    borderRadius: 16,
    borderRadiusLG: 12,
    borderRadiusXL: 16,
    borderRadiusSM: 6,
    borderRadiusXS: 4,

    // Shadows
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2)',
    boxShadowSecondary:
      '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
    boxShadowTertiary:
      '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
  },
  algorithm: [theme.darkAlgorithm],
  components: {
    Layout: {
      headerBg: '#1e293b',
      headerColor: '#f1f5f9',
      headerHeight: 64,
      headerPaddingInline: 24,
      siderBg: '#1e293b',
      siderBorderColor: '#475569',
      bodyBg: '#0f172a',
      footerBg: '#1e293b',
      footerPadding: '24px 50px',
    },
    Menu: {
      itemBg: 'transparent',
      itemSelectedBg: '#1e3a8a',
      itemHoverBg: '#334155',
      itemActiveBg: '#1e3a8a',
      itemSelectedColor: '#60a5fa',
      itemColor: '#cbd5e1',
      itemHoverColor: '#f1f5f9',
      itemHeight: 40,
      itemMarginInline: 8,
      itemBorderRadius: 8,
      itemPaddingInline: 16,
      subMenuItemBg: 'transparent',
      groupTitleColor: '#64748b',
      groupTitleFontSize: 12,
      groupTitleLineHeight: 1.5,
    },
    Button: {
      borderRadius: 8,
      fontWeight: 500,
      controlHeight: 36,
      controlHeightLG: 44,
      controlHeightSM: 28,
      paddingInline: 16,
      paddingInlineLG: 20,
      paddingInlineSM: 12,
    },
    Card: {
      borderRadius: 16,
      borderColor: '#475569',
      headerBg: '#1e293b',
      headerFontSize: 16,
      headerFontWeight: 600,
      bodyBg: '#1e293b',
      boxShadow:
        '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2)',
    },
    Input: {
      borderRadius: 8,
      borderColor: '#475569',
      borderColorHover: '#64748b',
      borderColorFocus: '#60a5fa',
      controlHeight: 40,
      controlHeightLG: 48,
      controlHeightSM: 32,
      paddingInline: 12,
      paddingInlineLG: 16,
      paddingInlineSM: 8,
      activeBorderColor: '#60a5fa',
      hoverBorderColor: '#64748b',
      colorBgContainer: '#1f293a', // Input background
      colorText: '#f1f5f9',
      colorTextPlaceholder: '#64748b',
    },
    Table: {
      borderRadius: 12,
      headerBg: '#334155',
      headerColor: '#f1f5f9',
      headerFontWeight: 600,
      rowHoverBg: '#334155',
      borderColor: '#475569',
      colorBgContainer: '#1e293b',
    },
    Avatar: {
      borderRadius: 8,
      colorBgContainer: '#475569',
    },
    Dropdown: {
      borderRadius: 12,
      controlItemBgHover: '#334155',
      controlItemBgActive: '#1e3a8a',
      boxShadow:
        '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
      colorBgElevated: '#334155',
    },
    Tooltip: {
      borderRadius: 8,
      colorBgSpotlight: '#334155',
      colorTextLightSolid: '#f1f5f9',
    },
    Divider: {
      colorSplit: '#475569',
    },
  },
}

const IsMounted = ({ children }: { children: React.ReactNode }) => {
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => {
    setIsMounted(true)
  }, [])
  return <>{isMounted && children}</>
}

// Define AppContent to use contexts after being wrapped by Context Providers
const AppContent = ({ children }: { children: React.ReactNode }) => {
  const { actualTheme } = useTheme()

  return (
    <ConfigProvider
      theme={actualTheme === Theme.Light ? themeLightConfig : themeDarkConfig}
    >
      {/* Add theme name for custom styling */}
      <div className={actualTheme}>
        <IsMounted>{children}</IsMounted>
      </div>
    </ConfigProvider>
  )
}

// Define AppProvider to use global Contexts
export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <AntApp>
      <AppContent>{children}</AppContent>
    </AntApp>
  )
}
