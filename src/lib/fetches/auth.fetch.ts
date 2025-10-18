import type { ApiResponse, UserCreateInput, UserLoginInput } from '@/lib/types'

import { API_BASE_URL, postFetch } from '.'
import type { AuthResponseData } from '../types/auth'

// Login user
export const fetchLogin = (
  data: UserLoginInput,
): Promise<ApiResponse<AuthResponseData>> => {
  return postFetch<AuthResponseData>(`${API_BASE_URL}/auth/login`, data)
}

// Register new user
export const fetchRegister = (
  data: UserCreateInput,
): Promise<ApiResponse<AuthResponseData>> => {
  return postFetch(`${API_BASE_URL}/auth/register`, data)
}
