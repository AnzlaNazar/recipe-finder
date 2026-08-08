import { useAuthViewModel } from './useAuthViewModel'

function AuthView() {
  const { state, updateField } = useAuthViewModel()

  return (
    <main>
      <h1>Authentication</h1>
      <p>Auth flow will be implemented soon.</p>

      <form>
        <label>
          Email
          <input
            type="email"
            value={state.email}
            onChange={(event) => updateField('email', event.target.value)}
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={state.password}
            onChange={(event) => updateField('password', event.target.value)}
          />
        </label>

        {state.error && <p role="alert">{state.error}</p>}
      </form>
    </main>
  )
}

export default AuthView
