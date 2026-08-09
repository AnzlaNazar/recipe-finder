import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header/Header'

function AppLayout() {
  const location = useLocation()
  const shouldShowHeader = location.pathname !== '/'

  return (
    <>
      {shouldShowHeader && <Header query="" onQueryChange={() => undefined} onSearch={() => undefined} />}
      <Outlet />
    </>
  )
}

export default AppLayout
