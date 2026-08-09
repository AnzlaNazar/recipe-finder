import type { Meal } from '../../types/meal'
import { addFavourite, getFavourites, removeFavourite } from '../../services/firebaseService'

export async function loadFavourites(userId: string): Promise<Meal[]> {
  if (!userId?.trim()) {
    throw new Error('A signed-in user is required to load favourites.')
  }

  return getFavourites(userId)
}

export async function saveFavourite(userId: string, meal: Meal): Promise<void> {
  if (!userId?.trim()) {
    throw new Error('A signed-in user is required to save favourites.')
  }

  await addFavourite(userId, meal)
}

export async function deleteFavourite(userId: string, idMeal: string): Promise<void> {
  if (!userId?.trim()) {
    throw new Error('A signed-in user is required to remove favourites.')
  }

  await removeFavourite(userId, idMeal)
}
