import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomeView from './pages/Home/HomeView'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeView />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
