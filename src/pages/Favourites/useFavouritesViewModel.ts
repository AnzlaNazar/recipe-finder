import { useState, useCallback, useEffect } from 'react'
import type { Meal } from '../../types/meal'
import { getFavourites, removeFavourite } from '../../services/favouritesService'

export function useFavouritesViewModel() {
  const [favourites, setFavourites] = useState<Meal[]>([])

  const loadFavourites = useCallback(() => {
    setFavourites(getFavourites())
  }, [])

  useEffect(() => {
    loadFavourites()
  }, [loadFavourites])

  function handleRemove(id: string) {
    removeFavourite(id)
    loadFavourites()
  }

  return {
    favourites,
    handleRemove,
  }
}
