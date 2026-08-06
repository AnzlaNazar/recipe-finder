import { useState } from 'react'
import { getMeals } from './HomeModel'
import type { Meal } from '../../types/meal'

export function useHomeViewModel() {
  const [query, setQuery] = useState<string>('')
  const [meals, setMeals] = useState<Meal[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSearch() {
    setLoading(true)
    setError(null)

    try {
      const mealList = await getMeals(query)
      setMeals(mealList)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return {
    query,
    setQuery,
    meals,
    loading,
    error,
    handleSearch,
  }
}
