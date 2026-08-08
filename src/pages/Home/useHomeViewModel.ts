import { useState, useEffect, useCallback } from 'react'
import { getMeals, initialMeals } from './HomeModel'
import type { Meal } from '../../types/meal'
import { loadFavourites, saveFavourite } from '../Favourites/FavouritesModel'

export function useHomeViewModel() {
  const [query, setQuery] = useState<string>('')
  const [meals, setMeals] = useState<Meal[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [favouriteIds, setFavouriteIds] = useState<Set<string>>(new Set())

  const syncFavouriteIds = useCallback(async () => {
    const favourites = await loadFavourites()
    setFavouriteIds(new Set(favourites.map((meal) => meal.idMeal)))
  }, [])

  const loadInitialMeals = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const mealList = await initialMeals()
      setMeals(mealList)
      await syncFavouriteIds()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [syncFavouriteIds])

  useEffect(() => {
    loadInitialMeals()
  }, [loadInitialMeals])

  async function handleSearch() {
    setLoading(true)
    setError(null)

    try {
      const mealList = await getMeals(query)
      setMeals(mealList)
      await syncFavouriteIds()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  function resetHome() {
    setQuery('')
    void loadInitialMeals()
  }

  async function handleFavourite(meal: Meal) {
    try {
      await saveFavourite(meal)
      await syncFavouriteIds()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save favourite.'
      setError(message)
    }
  }

  return {
    query,
    setQuery,
    meals,
    loading,
    error,
    handleSearch,
    resetHome,
    handleFavourite,
    favouriteIds,
  }
}
