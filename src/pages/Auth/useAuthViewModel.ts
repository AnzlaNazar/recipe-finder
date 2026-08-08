import { useMemo, useState } from 'react'
import { initialAuthFormState, type AuthFormState, type AuthViewModelState } from './AuthModel'

export function useAuthViewModel() {
  const [form, setForm] = useState<AuthFormState>(initialAuthFormState)
  const [loading] = useState(false)
  const [error] = useState<string | null>(null)

  const state = useMemo<AuthViewModelState>(
    () => ({
      email: form.email,
      password: form.password,
      loading,
      error,
    }),
    [error, form.email, form.password, loading],
  )

  function updateField(field: keyof AuthFormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  return {
    state,
    updateField,
  }
}
