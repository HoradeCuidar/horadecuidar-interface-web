import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { FiMenu, FiX } from 'react-icons/fi'
import { Sidebar } from '@/components'

export function MainLayout() {
  const [menuAberto, setMenuAberto] = useState(false)

  useEffect(() => {
    if (!menuAberto) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = original
    }
  }, [menuAberto])

  function fecharMenu() {
    setMenuAberto(false)
  }

  return (
    <div className="flex min-h-screen bg-surface-200">
      <aside className="sticky top-0 hidden h-screen w-[15.5rem] shrink-0 lg:block xl:w-[16.5rem]">
        <Sidebar />
      </aside>

      {menuAberto && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Fechar menu"
            onClick={fecharMenu}
          />
          <div className="absolute inset-y-0 left-0 z-50 w-[min(18rem,85vw)] shadow-xl">
            <Sidebar onNavigate={fecharMenu} />
          </div>
        </div>
      )}

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-zinc-200 bg-surface-50 px-4 py-3 lg:hidden">
          <button
            type="button"
            onClick={() => setMenuAberto(true)}
            className="rounded-lg p-2 text-[#1A2D37] transition hover:bg-zinc-100"
            aria-label="Abrir menu"
          >
            {menuAberto ? <FiX className="size-6" /> : <FiMenu className="size-6" />}
          </button>
          <p className="text-sm font-semibold uppercase tracking-wide text-[#1A2D37]">
            Hora de Cuidar
          </p>
        </header>

        <main className="flex min-h-0 min-w-0 flex-1 flex-col border-t-4 border-brand-600 bg-surface-50">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
