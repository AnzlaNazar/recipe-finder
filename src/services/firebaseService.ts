import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { get, getDatabase, ref, remove, set } from 'firebase/database'
import type { Meal } from '../types/meal'

const STORAGE_KEY = 'recipe-app-favourites'

function getUserStorageKey(userId: string): string {
  return `${STORAGE_KEY}:${userId}`
}

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
let auth: ReturnType<typeof getAuth> | null = null

try {
  if (hasFirebaseConfig) {
    app = initializeApp(firebaseConfig)
    database = getDatabase(app)
    auth = getAuth(app)
  }
} catch {
  app = null
  database = null
  auth = null
}

function readLocalFavourites(userId: string): Meal[] {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const raw = window.localStorage.getItem(getUserStorageKey(userId))
    if (!raw) {
      return []
    }

    const parsed = JSON.parse(raw) as Meal[] | null
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeLocalFavourites(userId: string, meals: Meal[]): void {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(getUserStorageKey(userId), JSON.stringify(meals))
}

async function readFavouriteSnapshot(userId: string): Promise<Record<string, Meal>> {
  if (!database) {
    return {}
  }

  try {
    const snapshot = await get(ref(database, `users/${userId}/favourites`))

    if (!snapshot.exists()) {
      return {}
    }

    const value = snapshot.val() as Record<string, Meal> | null
    return value ?? {}
  } catch {
    return {}
  }
}

export async function addFavourite(userId: string, meal: Meal): Promise<void> {
  if (!userId?.trim()) {
    throw new Error('A signed-in user is required to save favourites.')
  }

  const existing = readLocalFavourites(userId)
  const nextMeals = existing.some((item) => item.idMeal === meal.idMeal)
    ? existing.map((item) => (item.idMeal === meal.idMeal ? meal : item))
    : [...existing, meal]

  writeLocalFavourites(userId, nextMeals)

  if (!database) {
    return
  }

  try {
    await set(ref(database, `users/${userId}/favourites/${meal.idMeal}`), meal)
  } catch {
    // Keep the local fallback in place even if Firebase writes fail.
  }
}

export async function removeFavourite(userId: string, idMeal: string): Promise<void> {
  if (!userId?.trim()) {
    throw new Error('A signed-in user is required to remove favourites.')
  }

  const nextMeals = readLocalFavourites(userId).filter((meal) => meal.idMeal !== idMeal)
  writeLocalFavourites(userId, nextMeals)

  if (!database) {
    return
  }

  try {
    await remove(ref(database, `users/${userId}/favourites/${idMeal}`))
  } catch {
    // Keep the local fallback in place even if Firebase writes fail.
  }
}

export async function getFavourites(userId: string): Promise<Meal[]> {
  if (!userId?.trim()) {
    throw new Error('A signed-in user is required to load favourites.')
  }

  const firebaseFavourites = await readFavouriteSnapshot(userId)
  const firebaseMeals = Object.values(firebaseFavourites)

  if (firebaseMeals.length > 0) {
    writeLocalFavourites(userId, firebaseMeals)
    return firebaseMeals
  }

  return readLocalFavourites(userId)
}

const db = database

export { auth, db, database }
