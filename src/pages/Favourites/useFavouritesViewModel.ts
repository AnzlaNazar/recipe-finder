import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import type { Meal } from '../../types/meal'
import { deleteFavourite, loadFavourites } from './FavouritesModel'

export function useFavouritesViewModel() {
  const { user } = useAuth()
  const [favourites, setFavourites] = useState<Meal[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  async function loadMeals() {
    setLoading(true)
    setError(null)

    try {
      if (!user?.uid) {
        setFavourites([])
        setError('Please sign in to view favourites.')
        return
      }

      const meals = await loadFavourites(user.uid)
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
      if (!user?.uid) {
        throw new Error('Please sign in to remove favourites.')
      }

      await deleteFavourite(user.uid, idMeal)
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