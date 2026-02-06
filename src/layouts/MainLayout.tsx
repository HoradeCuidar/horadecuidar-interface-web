import { Outlet } from 'react-router-dom'

export function MainLayout() {
  return (
    <div className="min-h-screen bg-surface-200">
      <main>
        <Outlet />
      </main>
    </div>
  )
}
