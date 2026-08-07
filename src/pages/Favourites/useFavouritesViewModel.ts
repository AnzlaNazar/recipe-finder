import { useEffect, useState } from 'react'
import type { Meal } from '../../types/meal'
import { getFavourites, removeFavourite } from '../../services/favouritesService'

export function useFavouritesViewModel() {
  const [favourites, setFavourites] = useState<Meal[]>([])

  useEffect(() => {
    setFavourites(getFavourites())
  }, [])

  function handleRemove(id: string) {
    removeFavourite(id)
    setFavourites(getFavourites())
  }

  return {
    favourites,
    handleRemove,
  }
}
