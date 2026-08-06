import { useFavouritesViewModel } from './useFavouritesViewModel'
import MealCard from '../../components/MealCard/MealCard'
import './FavouritesView.css'

function FavouritesView() {
  const { favourites, handleRemove } = useFavouritesViewModel()

  return (
    <main className="favourites">
      <header className="favourites__header">
        <h1>Favourites</h1>
        <p>Saved recipes appear here after tapping Favourite.</p>
      </header>

      {favourites.length === 0 ? (
        <p className="favourites__empty">No favourites saved yet.</p>
      ) : (
        <section className="favourites__list">
          {favourites.map((meal) => (
            <div key={meal.idMeal} className="favourites__item">
              <MealCard meal={meal} />
              <button
                type="button"
                className="favourites__remove"
                onClick={() => handleRemove(meal.idMeal)}
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
