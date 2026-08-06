import type { Meal } from '../types/meal'

const STORAGE_KEY = 'recipeApp.favourites'

function parseStoredFavourites(): Meal[] {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return []
  }

  try {
    const stored = JSON.parse(raw) as Meal[]
    return Array.isArray(stored) ? stored : []
  } catch {
    return []
  }
}

function saveFavourites(meals: Meal[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(meals))
}

export function getFavourites(): Meal[] {
  return parseStoredFavourites()
}

export function isFavourite(id: string): boolean {
  return parseStoredFavourites().some((meal) => meal.idMeal === id)
}

export function addFavourite(meal: Meal): void {
  const favourites = parseStoredFavourites()
  if (favourites.some((item) => item.idMeal === meal.idMeal)) {
    return
  }
  saveFavourites([...favourites, meal])
}

export function removeFavourite(id: string): void {
  const favourites = parseStoredFavourites()
  saveFavourites(favourites.filter((meal) => meal.idMeal !== id))
}
