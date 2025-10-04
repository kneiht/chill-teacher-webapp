'use client'

import { Typography, theme } from 'antd'

const { Text } = Typography
// Define the Logo component
export const Logo = () => {
  const { token } = theme.useToken()
  return (
    <Text style={{ whiteSpace: 'nowrap' }}>
      <Text
        style={{
          fontFamily: 'Poppins, sans-serif',
          color: token.colorPrimary,
          fontSize: '20px',
          fontWeight: 'bold',
        }}
      >
        chill
      </Text>
      <Text
        style={{
          fontFamily: 'Poppins, sans-serif',
          color: 'orange',
          fontSize: '20px',
          fontWeight: 'bold',
        }}
      >
        Teacher
      </Text>
    </Text>
  )
}
