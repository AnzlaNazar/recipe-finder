import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Header from './components/Header/Header'
import HomeView from './pages/Home/HomeView'

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomeView />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
