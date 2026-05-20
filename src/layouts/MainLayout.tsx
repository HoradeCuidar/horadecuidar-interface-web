import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/components'

export function MainLayout() {
  return (
    <div className="flex min-h-screen bg-surface-200">
      <Sidebar />
      <main className="min-w-0 flex-1 bg-surface-50 border-t-4 border-brand-600">
        <Outlet />
      </main>
    </div>
  )
}
