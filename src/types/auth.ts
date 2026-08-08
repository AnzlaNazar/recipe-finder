import type { ReactNode } from 'react'
import type { User } from 'firebase/auth'

export type AuthFormState = {
  email: string
  password: string
}

export type AuthViewModelState = {
  email: string
  password: string
  mode: 'login' | 'register'
  loading: boolean
  error: string | null
}

export type AuthContextValue = {
  user: User | null
  authLoading: boolean
  logout: () => Promise<void>
}

export type AuthProviderProps = {
  children: ReactNode
}
