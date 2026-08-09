import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import AppLayout from './components/AppLayout'
import AuthView from './pages/Auth/AuthView'
import HomeView from './pages/Home/HomeView'
import FavouritesView from './pages/Favourites/FavouritesView'
import MealDetailView from './pages/MealDetail/MealDetailView'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, authLoading } = useAuth()

  if (authLoading) {
    return null
  }

  if (!user) {
    return <Navigate to="/auth" replace />
  }

  return <>{children}</>
}

function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { user, authLoading } = useAuth()

  if (authLoading) {
    return null
  }

  if (user) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomeView />} />
          <Route path="/auth" element={<PublicOnlyRoute><AuthView /></PublicOnlyRoute>} />
          <Route
            path="/favourites"
            element={
              <ProtectedRoute>
                <FavouritesView />
              </ProtectedRoute>
            }
          />
          <Route path="/meal/:id" element={<MealDetailView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
