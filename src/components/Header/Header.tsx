import { Link } from 'react-router-dom'
import './Header.css'

type HeaderProps = {
  query: string
  onQueryChange: (value: string) => void
  onSearch: () => void
}

function Header({ query, onQueryChange, onSearch }: HeaderProps) {
  return (
    <header className="header">
      <div className="header__inner">
        <nav className="header__nav" aria-label="Main navigation">
          <Link className="header__nav-link" to="/">
            Home
          </Link>
          <Link className="header__nav-link" to="/favourites">
            Favourites
          </Link>
        </nav>

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
      </div>
    </header>
  )
}

export default Header
