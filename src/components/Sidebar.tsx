import { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import { NavLink } from 'react-router-dom'
import { authService } from '@/services'
import { Avatar } from '@/components/ui/Avatar'
import { LogoutButton } from '@/components/LogoutButton'
import { IconeCasa, IconeProfissional, IconePacientes, IconePerfil } from '@/components/icons'
import type { Role } from '@/types/auth'

const MIN_WIDTH = 200
const MAX_WIDTH = 400
const DEFAULT_WIDTH = 240

type NavItem = { to: string; label: string; icon: React.ComponentType<{ className?: string }> }

const navPorRole: Record<Role, NavItem[]> = {
  ADMIN: [
    { to: '/home', label: 'Dashboard', icon: IconeCasa },
    { to: '/profissionais', label: 'Profissional da Saúde', icon: IconeProfissional },
  ],
  PROFISSIONAL_DA_SAUDE: [
    { to: '/home', label: 'Dashboard', icon: IconeCasa },
    { to: '/pacientes', label: 'Pacientes', icon: IconePacientes },
    { to: '/meu-perfil', label: 'Meu perfil', icon: IconePerfil },
  ],
  PACIENTE: [
    { to: '/home', label: 'Dashboard', icon: IconeCasa },
    { to: '/meu-perfil', label: 'Meu perfil', icon: IconePerfil },
  ],
}

export function Sidebar() {
  const user = authService.getUser()
  const navItems = useMemo(
    () => (user?.role ? navPorRole[user.role] : navPorRole.ADMIN),
    [user?.role]
  )
  const [width, setWidth] = useState(DEFAULT_WIDTH)
  const [isDragging, setIsDragging] = useState(false)
  const sidebarRef = useRef<HTMLElement>(null)

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !sidebarRef.current) return
      const rect = sidebarRef.current.getBoundingClientRect()
      const newWidth = e.clientX - rect.left
      setWidth(Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, newWidth)))
    },
    [isDragging]
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  useEffect(() => {
    if (!isDragging) return
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  return (
    <aside
      ref={sidebarRef}
      style={{ width: `${width}px` }}
      className="relative flex shrink-0 flex-col border-r border-[#D1D5DB] bg-surface-50 shadow-[4px_0_12px_rgba(0,0,0,0.06)]"
    >
      <div className="flex items-start gap-3 p-6">
        <Avatar name={user?.username ?? 'Usuário'} />
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-text">
            {user?.username ?? 'Usuário'}
          </p>
          <p className="truncate text-sm text-text-muted">
            Logado
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 px-3 py-4">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] transition ${
                isActive
                  ? 'bg-brand-100 font-medium text-brand-600 [&_svg]:text-brand-600'
                  : 'text-text hover:bg-surface-100 [&_svg]:text-text'
              }`
            }
          >
            <Icon />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-surface-100 p-4">
        <LogoutButton />
      </div>

      <button
        type="button"
        onMouseDown={handleMouseDown}
        className="absolute right-0 top-0 z-10 h-full w-1.5 cursor-col-resize border-0 bg-transparent hover:bg-brand-300/30 active:bg-brand-400/40"
        aria-label="Redimensionar sidebar"
      />
    </aside>
  )
}
