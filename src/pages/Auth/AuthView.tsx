import { useAuthViewModel } from './useAuthViewModel'
import './AuthView.css'

function AuthView() {
  const { state, updateField, handleSubmit, toggleMode } = useAuthViewModel()

  return (
    <main className="auth">
      <div className="auth__card">
        <header className="auth__intro">
          <h1>{state.mode === 'login' ? 'Login' : 'Create Account'}</h1>
          <p>Use your email and password to continue.</p>
        </header>

        <form className="auth__form" onSubmit={(event) => handleSubmit(event)}>
          <div className="auth__field">
            <label className="auth__label" htmlFor="auth-email">
              Email
            </label>
            <input
              id="auth-email"
              className="auth__input"
              type="email"
              value={state.email}
              onChange={(event) => updateField('email', event.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="auth__field">
            <label className="auth__label" htmlFor="auth-password">
              Password
            </label>
            <input
              id="auth-password"
              className="auth__input"
              type="password"
              value={state.password}
              onChange={(event) => updateField('password', event.target.value)}
              autoComplete={state.mode === 'login' ? 'current-password' : 'new-password'}
            />
          </div>

          <button className="auth__submit" type="submit" disabled={state.loading}>
            {state.loading ? 'Please wait...' : state.mode === 'login' ? 'Login' : 'Create Account'}
          </button>
        </form>

        <button className="auth__toggle" type="button" onClick={toggleMode}>
          {state.mode === 'login' ? 'Need an account? Create one' : 'Already have an account? Login'}
        </button>

        {state.error && (
          <p className="auth__error" role="alert">
            {state.error}
          </p>
        )}
      </div>
    </main>
  )
}

export default AuthView