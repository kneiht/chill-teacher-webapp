export interface User {
  id: string
  name: string
  username: string
  email: string
  password: string
  role: 'ADMIN' | 'USER'
  avatar?: string
  phoneNumber?: string
  address?: string
  dob?: string
}

export interface UserCreateInput {
  email: string
  username: string
  password: string
  role: 'ADMIN' | 'USER'
}

export interface UserLoginInput {
  email: string
  password: string
}

export interface UserPublic {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'USER'
  avatar?: string
  phoneNumber?: string
  address?: string
  dob?: string
}

export interface UserUpdateInput {
  id: string
  name?: string
  email?: string
  password?: string
  role?: 'ADMIN' | 'USER'
  avatar?: string
  phoneNumber?: string
  address?: string
  dob?: string
}

export interface UserDeleteInput {
  id: string
}
