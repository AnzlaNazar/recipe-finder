import { useEffect, useState } from 'react'
import type { Meal } from '../../types/meal'
import { deleteFavourite, loadFavourites } from './FavouritesModel'

export function useFavouritesViewModel() {
  const [favourites, setFavourites] = useState<Meal[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  async function loadMeals() {
    setLoading(true)
    setError(null)

    try {
      const meals = await loadFavourites()
      setFavourites(meals)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load favourites.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadMeals()
  }, [])

  async function removeMeal(idMeal: string) {
    setError(null)

    try {
      await deleteFavourite(idMeal)
      setFavourites((current) => current.filter((meal) => meal.idMeal !== idMeal))
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to remove favourite.'
      setError(message)
    }
  }

  return {
    favourites,
    loading,
    error,
    loadMeals,
    removeMeal,
  }
}
