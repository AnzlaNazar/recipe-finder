import { Outlet } from 'react-router-dom'
import Header from './Header/Header'

function AppLayout() {
  return (
    <>
      <Header query="" onQueryChange={() => undefined} onSearch={() => undefined} />
      <Outlet />
    </>
  )
}

export default AppLayout
