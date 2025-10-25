export const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('access_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}
