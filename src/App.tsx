import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomeView from './pages/Home/HomeView'
import FavouritesView from './pages/Favourites/FavouritesView'
import MealDetailView from './pages/MealDetail/MealDetailView'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/favourites" element={<FavouritesView />} />
        <Route path="/meal/:id" element={<MealDetailView />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
