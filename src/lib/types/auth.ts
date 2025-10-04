import type { UserPublic } from './user'

export interface LoginResponseData {
  user: UserPublic
  token: {
    accessToken: string
  }
}
