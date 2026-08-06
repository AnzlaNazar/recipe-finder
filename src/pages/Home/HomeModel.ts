import { searchMeals } from '../../services/mealDbService'
import type { Meal } from '../../types/meal'

export async function getMeals(query: string): Promise<Meal[]> {
  const cleanedQuery = query.trim()

  if (cleanedQuery.length < 2) {
    throw new Error('Search query must contain at least 2 characters.')
  }

  return searchMeals(cleanedQuery)
}

// Fetch an initial set of meals to populate the Home screen.
// Uses a predefined seed list of keywords, runs parallel requests
// with Promise.all, deduplicates by `idMeal`, shuffles, and returns
// exactly 20 unique meals (or throws if not possible).
export async function initialMeals(): Promise<Meal[]> {
  const seeds = [
    'chicken',
    'beef',
    'pasta',
    'rice',
    'soup',
    'cake',
    'salad',
    'fish',
    'curry',
    'pork',
    'vegetarian',
    'breakfast',
    'dessert',
    'seafood',
    'lamb',
  ]

  function shuffle<T>(arr: T[]): T[] {
    const a = arr.slice()
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[a[i], a[j]] = [a[j], a[i]]
    }
    return a
  }

  // Pick a random subset size to vary requests across launches
  const minQueries = 6
  const maxQueries = seeds.length
  const selectedCount = Math.floor(Math.random() * (maxQueries - minQueries + 1)) + minQueries

  const shuffledSeeds = shuffle(seeds)
  const initialSeeds = shuffledSeeds.slice(0, selectedCount)

  // Run initial parallel requests
  const responses = await Promise.all(initialSeeds.map((q) => searchMeals(q)))
  let combined: Meal[] = responses.flat()

  // If not enough unique meals, try the remaining seeds
  if (combined.length < 20) {
    const remainingSeeds = shuffledSeeds.slice(selectedCount)
    if (remainingSeeds.length > 0) {
      const more = await Promise.all(remainingSeeds.map((q) => searchMeals(q)))
      combined = combined.concat(more.flat())
    }
  }

  // Deduplicate by idMeal
  const byId = new Map<string, Meal>()
  for (const meal of combined) {
    if (!byId.has(meal.idMeal)) {
      byId.set(meal.idMeal, meal)
    }
  }

  const uniqueMeals = shuffle(Array.from(byId.values()))

  if (uniqueMeals.length < 20) {
    throw new Error('Unable to gather 20 unique meals from seed keywords.')
  }

  return uniqueMeals.slice(0, 20)
}
