import { initializeApp } from 'firebase/app'
import { get, getDatabase, ref, remove, set } from 'firebase/database'
import type { Meal } from '../types/meal'

const STORAGE_KEY = 'recipe-app-favourites'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? '',
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL ?? '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? '',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ?? '',
}

const hasFirebaseConfig = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.databaseURL,
)

let app: ReturnType<typeof initializeApp> | null = null
let database: ReturnType<typeof getDatabase> | null = null

try {
  if (hasFirebaseConfig) {
    app = initializeApp(firebaseConfig)
    database = getDatabase(app)
  }
} catch {
  app = null
  database = null
}

const favouritesRef = database ? ref(database, 'favourites') : null

function readLocalFavourites(): Meal[] {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return []
    }

    const parsed = JSON.parse(raw) as Meal[] | null
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeLocalFavourites(meals: Meal[]): void {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(meals))
}

async function readFavouriteSnapshot(): Promise<Record<string, Meal>> {
  if (!favouritesRef) {
    return {}
  }

  try {
    const snapshot = await get(favouritesRef)

    if (!snapshot.exists()) {
      return {}
    }

    const value = snapshot.val() as Record<string, Meal> | null
    return value ?? {}
  } catch {
    return {}
  }
}

export async function addFavourite(meal: Meal): Promise<void> {
  const existing = readLocalFavourites()
  const nextMeals = existing.some((item) => item.idMeal === meal.idMeal)
    ? existing.map((item) => (item.idMeal === meal.idMeal ? meal : item))
    : [...existing, meal]

  writeLocalFavourites(nextMeals)

  if (!database) {
    return
  }

  try {
    await set(ref(database, `favourites/${meal.idMeal}`), meal)
  } catch {
    // Keep the local fallback in place even if Firebase writes fail.
  }
}

export async function removeFavourite(idMeal: string): Promise<void> {
  const nextMeals = readLocalFavourites().filter((meal) => meal.idMeal !== idMeal)
  writeLocalFavourites(nextMeals)

  if (!database) {
    return
  }

  try {
    await remove(ref(database, `favourites/${idMeal}`))
  } catch {
    // Keep the local fallback in place even if Firebase writes fail.
  }
}

export async function getFavourites(): Promise<Meal[]> {
  const firebaseFavourites = await readFavouriteSnapshot()
  const firebaseMeals = Object.values(firebaseFavourites)

  if (firebaseMeals.length > 0) {
    writeLocalFavourites(firebaseMeals)
    return firebaseMeals
  }

  return readLocalFavourites()
}

export { database }
