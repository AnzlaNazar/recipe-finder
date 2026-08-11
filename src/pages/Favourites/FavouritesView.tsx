import { Link } from 'react-router-dom'
import { useFavouritesViewModel } from './useFavouritesViewModel'
import MealCard from '../../components/MealCard/MealCard'
import './FavouritesView.css'

function FavouritesView() {
  const { favourites, loading, error, removeMeal } = useFavouritesViewModel()

  return (
    <main className="favourites">
      <Link className="favourites__back" to="/">
        ← Back to Home
      </Link>

      <header className="favourites__header">
        <h1>Favourites</h1>
        <p>Saved recipes appear here after tapping Favourite.</p>
      </header>

      {loading && <p className="favourites__status">Loading favourites…</p>}

      {error && (
        <p className="favourites__status" role="alert">
          {error}
        </p>
      )}

      {!loading && !error && favourites.length === 0 && (
        <p className="favourites__empty">No favourites saved yet.</p>
      )}

      {!loading && !error && favourites.length > 0 && (
        <section className="favourites__list">
          {favourites.map((meal) => (
            <div key={meal.idMeal} className="favourites__item">
              <MealCard meal={meal} />
              <button
                type="button"
                className="favourites__remove"
                onClick={() => removeMeal(meal.idMeal)}
              >
                Remove
              </button>
            </div>
          ))}
        </section>
      )}
    </main>
  )
}

export default FavouritesView