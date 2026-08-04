import { Link } from 'react-router-dom'
import './Header.css'

function Header() {
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
          onSubmit={(event) => event.preventDefault()}
        >
          <input
            className="header__search-input"
            type="search"
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
