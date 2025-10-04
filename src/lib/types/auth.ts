import type { UserPublic } from './user'

export interface AuthResponseData {
  user: UserPublic
  token: {
    accessToken: string
  }
}
