import type { ApiResponse, User, UserUpdateInput } from '@/lib/types'
import { getAuthHeaders } from '@/lib/utils/auth-helpers'
import { API_BASE_URL, putFetch } from '.'

// Update user
export const updateUser = (
  id: string,
  data: UserUpdateInput,
): Promise<ApiResponse<User>> => {
  return putFetch(`${API_BASE_URL}/users/${id}`, data, getAuthHeaders())
}
