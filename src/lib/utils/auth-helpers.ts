import Cookies from 'js-cookie'

export const getAuthHeaders = (): Record<string, string> => {
  const token = Cookies.get('accessToken')
  return token ? { Authorization: `Bearer ${token}` } : {}
}
