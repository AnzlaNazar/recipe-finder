import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
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

  return (
    <>
      <header className="header">
        <div className="header__inner">
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
            <button className="header__search-button" type="submit">
              Search
            </button>
          </form>

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
          <Link className="header__drawer-link" to="/" onClick={closeDrawer}>
            Home
          </Link>
          <Link className="header__drawer-link" to="/favourites" onClick={closeDrawer}>
            Favourites
          </Link>

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
