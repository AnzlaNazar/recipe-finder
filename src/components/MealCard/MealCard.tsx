import type { Meal } from '../../types/meal'
import './MealCard.css'

type MealCardProps = {
  meal: Meal
  onFavourite?: (meal: Meal) => void
  isFavourite?: boolean
}

function MealCard({ meal, onFavourite, isFavourite = false }: MealCardProps) {
  return (
    <article className="meal-card">
      <img src={meal.strMealThumb} alt={meal.strMeal} className="meal-card__image" />
      <div className="meal-card__content">
        <h2 className="meal-card__title">{meal.strMeal}</h2>
        <p className="meal-card__meta">Category: {meal.strCategory ?? 'Unknown'}</p>
        <p className="meal-card__meta">Area: {meal.strArea ?? 'Unknown'}</p>
        <div className="meal-card__actions">
          <a className="meal-card__link" href={`/meal/${meal.idMeal}`}>
            View recipe
          </a>
          <button
            type="button"
            className="meal-card__favourite"
            onClick={() => onFavourite?.(meal)}
          >
            {isFavourite ? 'Saved' : 'Favourite'}
          </button>
        </div>
      </div>
    </article>
  )
}

export default MealCard
