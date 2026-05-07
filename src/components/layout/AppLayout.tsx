import { Outlet } from 'react-router-dom'
import { AppSidebar } from './AppSidebar'
import { AppHeader } from './AppHeader'

export function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AppSidebar />

      {/* Main — offset by sidebar width */}
      <div className="ml-56 flex flex-col min-h-screen">
        <AppHeader />

        <main className="flex-1 px-6 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
