import { useAuthViewModel } from './useAuthViewModel'

function AuthView() {
  const { state, updateField, handleSubmit, toggleMode } = useAuthViewModel()

  return (
    <main>
      <h1>{state.mode === 'login' ? 'Login' : 'Create Account'}</h1>
      <p>Use your email and password to continue.</p>

      <form onSubmit={(event) => handleSubmit(event)}>
        <label>
          Email
          <input
            type="email"
            value={state.email}
            onChange={(event) => updateField('email', event.target.value)}
            autoComplete="email"
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={state.password}
            onChange={(event) => updateField('password', event.target.value)}
            autoComplete={state.mode === 'login' ? 'current-password' : 'new-password'}
          />
        </label>

        <button type="submit" disabled={state.loading}>
          {state.loading ? 'Please wait...' : state.mode === 'login' ? 'Login' : 'Create Account'}
        </button>
      </form>

      <button type="button" onClick={toggleMode}>
        {state.mode === 'login' ? 'Need an account? Create one' : 'Already have an account? Login'}
      </button>

      {state.error && <p role="alert">{state.error}</p>}
    </main>
  )
}

export default AuthView
