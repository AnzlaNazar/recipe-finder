import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { User } from 'firebase/auth'
import { logoutUser, subscribeToAuthChanges } from '../services/authService'

type AuthContextValue = {
  user: User | null
  authLoading: boolean
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((nextUser) => {
      setUser(nextUser)
      setAuthLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      authLoading,
      logout: async () => {
        await logoutUser()
      },
    }),
    [authLoading, user],
  )

  if (authLoading) {
    return <div>Initializing authentication...</div>
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
