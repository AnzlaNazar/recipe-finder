import { initializeApp } from 'firebase/app'
import { get, getDatabase, ref, remove, set } from 'firebase/database'
import type { Meal } from '../types/meal'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

const app = initializeApp(firebaseConfig)
const database = getDatabase(app)

const favouritesRef = ref(database, 'favourites')

async function readFavouriteSnapshot(): Promise<Record<string, Meal>> {
  try {
    const snapshot = await get(favouritesRef)

    if (!snapshot.exists()) {
      return {}
    }

    const value = snapshot.val() as Record<string, Meal> | null
    return value ?? {}
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to read favourites from Firebase.',
    )
  }
}

export async function addFavourite(meal: Meal): Promise<void> {
  try {
    await set(ref(database, `favourites/${meal.idMeal}`), meal)
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to add favourite meal.',
    )
  }
}

export async function removeFavourite(idMeal: string): Promise<void> {
  try {
    await remove(ref(database, `favourites/${idMeal}`))
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to remove favourite meal.',
    )
  }
}

export async function getFavourites(): Promise<Meal[]> {
  const favourites = await readFavouriteSnapshot()
  return Object.values(favourites)
}

export { database }
