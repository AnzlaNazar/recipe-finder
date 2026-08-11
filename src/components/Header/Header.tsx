import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import dishlyLogoLight from '../../assets/dishly-logo-theme-light.png'
import dishlyLogoDark from '../../assets/dishly-logo-theme-dark.png'
import './Header.css'

type HeaderProps = {
  query: string
  onQueryChange: (value: string) => void
  onSearch: () => void
  onHomeClick?: () => void
}

function Header({ query, onQueryChange, onSearch, onHomeClick }: HeaderProps) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') {
      return 'light'
    }

    return (window.localStorage.getItem('recipe-theme') as 'light' | 'dark' | null) ?? 'light'
  })
  const drawerRef = useRef<HTMLDivElement | null>(null)
  const toggleRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    window.localStorage.setItem('recipe-theme', theme)
  }, [theme])

  useEffect(() => {
    if (!isDrawerOpen) {
      return
    }

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node
      if (drawerRef.current?.contains(target) || toggleRef.current?.contains(target)) {
        return
      }
      setIsDrawerOpen(false)
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDrawerOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isDrawerOpen])

  function closeDrawer() {
    setIsDrawerOpen(false)
  }

  async function handleLogout() {
    closeDrawer()
    await logout()
    navigate('/')
  }

  function toggleTheme() {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'))
  }

  function handleHomeNav() {
    onHomeClick?.()
  }

  return (
    <>
      <header className="header">
        <div className="header__inner">
          <Link className="header__brand" to="/" onClick={handleHomeNav} aria-label="Dishly home">
            <img
              className="header__logo"
              src={theme === 'light' ? dishlyLogoLight : dishlyLogoDark}
              alt="Dishly"
            />
          </Link>

          <form
            className="header__search"
            onSubmit={(event) => {
              event.preventDefault()
              onSearch()
            }}
          >
            <input
              className="header__search-input"
              type="search"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Search recipes..."
              aria-label="Search recipes"
            />
            <button className="header__search-button" type="submit" aria-label="Search">
              <svg
                className="header__search-button-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <span className="header__search-button-text">Search</span>
            </button>
          </form>

          <div className="header__actions">
            <Link className="header__nav-link" to="/favourites" aria-label="Favourites" title="Favourites">
              <svg
                className="header__nav-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 20.5s-7.5-4.6-10-9.3C0.3 8 1.6 4.6 4.7 3.6c2-.6 4 .1 5.3 1.9C11.3 3.7 13.3 3 15.3 3.6c3.1 1 4.4 4.4 2.7 7.6-2.5 4.7-10 9.3-10 9.3Z" />
              </svg>
            </Link>

            <button
              ref={toggleRef}
              className="header__menu-button"
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={isDrawerOpen}
            >
              ☰
            </button>
          </div>
        </div>
      </header>

      <div className={`header__drawer-backdrop ${isDrawerOpen ? 'is-open' : ''}`} />

      <aside ref={drawerRef} className={`header__drawer ${isDrawerOpen ? 'is-open' : ''}`}>
        <div className="header__drawer-header">
          <h2>Menu</h2>
          <button className="header__drawer-close" type="button" onClick={closeDrawer}>
            ×
          </button>
        </div>

        <nav className="header__drawer-nav" aria-label="Drawer navigation">
          <button className="header__drawer-action" type="button" onClick={toggleTheme}>
            {theme === 'light' ? '🌙 Dark mode' : '☀️ Light mode'}
          </button>

          {!user ? (
            <Link className="header__drawer-action header__drawer-action--primary" to="/auth" onClick={closeDrawer}>
              Login / Sign up
            </Link>
          ) : (
            <button className="header__drawer-action header__drawer-action--primary" type="button" onClick={handleLogout}>
              Logout
            </button>
          )}
        </nav>
      </aside>
    </>
  )
}

export default Header