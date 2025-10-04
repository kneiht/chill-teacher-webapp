import type { UseCaseResponse, User, UserUpdateInput } from '@/lib/types'
import { getAuthHeaders } from '@/lib/utils/auth-helpers'

const API_BASE_URL = 'http://localhost:3000'

export const updateUser = async (
  id: string,
  data: UserUpdateInput,
): Promise<UseCaseResponse<User>> => {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  })
  const body: UseCaseResponse<User> = await response.json()
  if (body.type === 'UNAUTHORIZED') {
    import('js-cookie').then(({ default: Cookies }) => {
      Cookies.remove('accessToken')
      window.location.href = '/auth/login'
    })
  }
  return body
}
