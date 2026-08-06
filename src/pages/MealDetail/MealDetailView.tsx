import { Link } from 'react-router-dom'
import { useMealDetailViewModel } from './useMealDetailViewModel'
import './MealDetailView.css'

import type { Meal } from '../../types/meal'

function getIngredientRows(meal: Meal) {
  const rows: string[] = []
  const recordMeal = meal as unknown as Record<string, string | undefined>

  for (let index = 1; index <= 20; index++) {
    const ingredient = recordMeal[`strIngredient${index}`]
    const measure = recordMeal[`strMeasure${index}`]

    if (ingredient && ingredient.trim()) {
      const formattedMeasure = measure?.trim() ? `${measure.trim()} ` : ''
      rows.push(`${formattedMeasure}${ingredient.trim()}`)
    }
  }

  return rows
}

function MealDetailView() {
  const { meal, loading, error } = useMealDetailViewModel()
  const ingredientRows = meal ? getIngredientRows(meal) : []

  return (
    <main className="meal-detail">
      <div className="meal-detail__header">
        <Link className="meal-detail__back" to="/">
          ← Back to home
        </Link>
      </div>

      {loading && <p>Loading recipe...</p>}
      {error && <p role="alert">{error}</p>}

      {meal && (
        <article className="meal-detail__card">
          <img src={meal.strMealThumb} alt={meal.strMeal} className="meal-detail__image" />
          <div className="meal-detail__content">
            <h1>{meal.strMeal}</h1>
            <div className="meal-detail__meta">
              <span>Category: {meal.strCategory ?? 'Unknown'}</span>
              <span>Area: {meal.strArea ?? 'Unknown'}</span>
            </div>

            {meal.strTags && (
              <p className="meal-detail__tags">Tags: {meal.strTags}</p>
            )}

            {meal.strInstructions && (
              <section className="meal-detail__section">
                <h2>Instructions</h2>
                <p>{meal.strInstructions}</p>
              </section>
            )}

            {ingredientRows.length > 0 && (
              <section className="meal-detail__section">
                <h2>Ingredients</h2>
                <ul className="meal-detail__ingredients">
                  {ingredientRows.map((row) => (
                    <li key={row}>{row}</li>
                  ))}
                </ul>
              </section>
            )}

            <div className="meal-detail__links">
              {meal.strSource && (
                <a href={meal.strSource} target="_blank" rel="noreferrer">
                  Source
                </a>
              )}
              {meal.strYoutube && (
                <a href={meal.strYoutube} target="_blank" rel="noreferrer">
                  YouTube video
                </a>
              )}
            </div>
          </div>
        </article>
      )}
    </main>
  )
}

export default MealDetailView
