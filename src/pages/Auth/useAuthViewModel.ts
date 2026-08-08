import { useMemo, useState } from 'react'
import { initialAuthFormState } from './AuthModel'
import { login, register } from './AuthModel'
import type { AuthFormState, AuthViewModelState } from '../../types/auth'

export function useAuthViewModel() {
  const [form, setForm] = useState<AuthFormState>(initialAuthFormState)
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const state = useMemo<AuthViewModelState>(
    () => ({
      email: form.email,
      password: form.password,
      mode,
      loading,
      error,
    }),
    [error, form.email, form.password, loading, mode],
  )

  function updateField(field: keyof AuthFormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function handleSubmit(event?: { preventDefault?: () => void }) {
    event?.preventDefault?.()

    setError(null)
    setLoading(true)

    try {
      if (mode === 'login') {
        await login(form.email, form.password)
      } else {
        await register(form.email, form.password)
      }

      setForm((current) => ({ ...current, password: '' }))
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Authentication failed.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  function toggleMode() {
    setMode((current) => (current === 'login' ? 'register' : 'login'))
    setError(null)
  }

  return {
    state,
    updateField,
    handleSubmit,
    toggleMode,
  }
}
