import type { Meal, MealDbSearchResponse } from '../types/meal'

/**
 * Service for communicating with TheMealDB API.
 * Recipe data fetching and related API calls will be implemented here.
 */

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1/'

export async function searchMeals(query: string): Promise<Meal[]> {
  const url = `${BASE_URL}search.php?s=${encodeURIComponent(query)}`

  let response: Response

  try {
    response = await fetch(url)
  } catch {
    throw new Error(`Failed to reach TheMealDB API for query "${query}".`)
  }

  if (!response.ok) {
    throw new Error(
      `TheMealDB API request failed with status ${response.status} for query "${query}".`,
    )
  }

  const data = (await response.json()) as MealDbSearchResponse

  return data.meals ?? []
}

export async function getMealById(id: string): Promise<Meal | null> {
  const url = `${BASE_URL}lookup.php?i=${encodeURIComponent(id)}`

  let response: Response

  try {
    response = await fetch(url)
  } catch {
    throw new Error(`Failed to reach TheMealDB API for meal id "${id}".`)
  }

  if (!response.ok) {
    throw new Error(
      `TheMealDB API request failed with status ${response.status} for meal id "${id}".`,
    )
  }

  const data = (await response.json()) as MealDbSearchResponse

  return data.meals ? data.meals[0] ?? null : null
}
