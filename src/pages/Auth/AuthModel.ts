export type AuthFormState = {
  email: string
  password: string
}

export type AuthViewModelState = {
  email: string
  password: string
  loading: boolean
  error: string | null
}

export const initialAuthFormState: AuthFormState = {
  email: '',
  password: '',
}
