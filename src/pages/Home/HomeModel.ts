import { searchMeals } from '../../services/mealDbService'
import type { Meal } from '../../types/meal'

export async function getMeals(query: string): Promise<Meal[]> {
  const cleanedQuery = query.trim()

  if (cleanedQuery.length < 2) {
    throw new Error('Search query must contain at least 2 characters.')
  }

  return searchMeals(cleanedQuery)
}
