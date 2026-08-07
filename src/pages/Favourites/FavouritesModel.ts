import type { Meal } from '../../types/meal'
import { addFavourite, getFavourites, removeFavourite } from '../../services/firebaseService'

export async function loadFavourites(): Promise<Meal[]> {
  return getFavourites()
}

export async function saveFavourite(meal: Meal): Promise<void> {
  await addFavourite(meal)
}

export async function deleteFavourite(idMeal: string): Promise<void> {
  await removeFavourite(idMeal)
}
