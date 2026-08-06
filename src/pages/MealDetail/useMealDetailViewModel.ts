import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getMealById } from '../../services/mealDbService'
import type { Meal } from '../../types/meal'

export function useMealDetailViewModel() {
  const { id } = useParams<{ id: string }>()
  const [meal, setMeal] = useState<Meal | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setError('No recipe selected.')
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    getMealById(id)
      .then((result) => {
        if (!result) {
          setError('Recipe not found.')
          return
        }
        setMeal(result)
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Unable to load recipe.')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [id])

  return {
    meal,
    loading,
    error,
  }
}
