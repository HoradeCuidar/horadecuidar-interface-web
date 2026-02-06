import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-50 p-4 font-sans">
      <Outlet />
    </div>
  )
}
