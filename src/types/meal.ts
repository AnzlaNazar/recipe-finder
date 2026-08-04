export interface Meal {
  idMeal: string
  strMeal: string
  strMealThumb: string
  strCategory?: string
  strArea?: string
}

export interface MealDbSearchResponse {
  meals: Meal[] | null
}
