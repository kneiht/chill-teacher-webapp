import type {
  UseCaseResponse,
  UserCreateInput,
  UserLoginInput,
  UserPublic,
} from '@/lib/types'

const API_BASE_URL = 'http://localhost:3000'

export const fetchLogin = async (
  data: UserLoginInput,
): Promise<
  UseCaseResponse<{ user: UserPublic; token: { accessToken: string } }>
> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  const body: UseCaseResponse<{
    user: UserPublic
    token: { accessToken: string }
  }> = await response.json()
  if (body.type === 'UNAUTHORIZED') {
    import('js-cookie').then(({ default: Cookies }) => {
      Cookies.remove('accessToken')
      window.location.href = '/auth/login'
    })
  }
  return body
}

export const fetchRegister = async (
  data: UserCreateInput,
): Promise<
  UseCaseResponse<{ user: UserPublic; token: { accessToken: string } }>
> => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  const body: UseCaseResponse<{
    user: UserPublic
    token: { accessToken: string }
  }> = await response.json()
  if (body.type === 'UNAUTHORIZED') {
    import('js-cookie').then(({ default: Cookies }) => {
      Cookies.remove('accessToken')
      window.location.href = '/auth/login'
    })
  }
  return body
}
