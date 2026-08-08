import type { User } from 'firebase/auth'
import { loginUser, logoutUser, registerUser } from '../../services/authService'
import type { AuthFormState } from '../../types/auth'

export const initialAuthFormState: AuthFormState = {
  email: '',
  password: '',
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

function validateCredentials(email: string, password: string): { normalizedEmail: string } {
  const normalizedEmail = normalizeEmail(email)

  if (!normalizedEmail) {
    throw new Error('Email is required.')
  }

  if (!password.trim()) {
    throw new Error('Password is required.')
  }

  if (password.trim().length < 6) {
    throw new Error('Password must be at least 6 characters long.')
  }

  return { normalizedEmail }
}

export async function register(email: string, password: string): Promise<User> {
  const { normalizedEmail } = validateCredentials(email, password)
  return registerUser(normalizedEmail, password)
}

export async function login(email: string, password: string): Promise<User> {
  const { normalizedEmail } = validateCredentials(email, password)
  return loginUser(normalizedEmail, password)
}

export async function logout(): Promise<void> {
  return logoutUser()
}
