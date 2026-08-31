import { Outlet } from 'react-router-dom'
import AppHeader from './AppHeader'
import AppFooter from './AppFooter'

/** Authenticated shell: fixed header + scrolling content + footer. */
function AppLayout() {
  return (
    <div className="flex flex-auto flex-col min-h-[100svh] bg-w-page text-w-ink">
      <AppHeader />
      <main className="flex-auto">
        <Outlet />
      </main>
      <AppFooter />
    </div>
  )
}

export default AppLayout
