import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth'
import { auth } from './firebaseService'

function getErrorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const message = String((error as { message?: string }).message ?? '')
    if (message) {
      return message
    }
  }

  return 'An unexpected authentication error occurred.'
}

export async function registerUser(email: string, password: string): Promise<User> {
  if (!auth) {
    throw new Error('Firebase Auth is not configured.')
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    return userCredential.user
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function loginUser(email: string, password: string): Promise<User> {
  if (!auth) {
    throw new Error('Firebase Auth is not configured.')
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return userCredential.user
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function logoutUser(): Promise<void> {
  if (!auth) {
    throw new Error('Firebase Auth is not configured.')
  }

  try {
    await signOut(auth)
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export function subscribeToAuthChanges(callback: (user: User | null) => void): () => void {
  if (!auth) {
    callback(null)
    return () => undefined
  }

  return onAuthStateChanged(auth, callback)
}
