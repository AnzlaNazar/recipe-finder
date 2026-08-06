import type { Meal } from '../../types/meal'
import './MealCard.css'

type MealCardProps = {
  meal: Meal
}

function MealCard({ meal }: MealCardProps) {
  return (
    <article className="meal-card">
      <img src={meal.strMealThumb} alt={meal.strMeal} className="meal-card__image" />
      <div className="meal-card__content">
        <h2 className="meal-card__title">{meal.strMeal}</h2>
        <p className="meal-card__meta">Category: {meal.strCategory ?? 'Unknown'}</p>
        <p className="meal-card__meta">Area: {meal.strArea ?? 'Unknown'}</p>
        <button type="button" className="meal-card__favourite">
          Favourite
        </button>
      </div>
    </article>
  )
}

export default MealCard
