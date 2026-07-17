import { useEffect, useMemo, useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  FiGrid,
  FiUsers,
  FiUser,
  FiBriefcase,
} from 'react-icons/fi'
import { authService } from '@/services'
import { LogoutButton } from '@/components/LogoutButton'
import { Avatar } from '@/components'
import logo from '@/assets/logo.svg'
import type { Role } from '@/types/auth'
import { USER_UPDATED_EVENT } from '@/types/auth'

type NavItem = {
  to: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const ROLE_LABEL: Record<Role, string> = {
  ADMIN: 'Administrador',
  PROFISSIONAL_DA_SAUDE: 'Profissional da Saúde',
  PACIENTE: 'Participante',
}

const navPorRole: Record<Role, NavItem[]> = {
  ADMIN: [
    { to: '/home', label: 'Dashboard', icon: FiGrid },
    { to: '/profissionais', label: 'Profissionais', icon: FiBriefcase },
    { to: '/meu-perfil', label: 'Meu perfil', icon: FiUser },
  ],
  PROFISSIONAL_DA_SAUDE: [
    { to: '/home', label: 'Dashboard', icon: FiGrid },
    { to: '/pacientes', label: 'Pacientes', icon: FiUsers },
    { to: '/meu-perfil', label: 'Meu perfil', icon: FiUser },
  ],
  PACIENTE: [
    { to: '/home', label: 'Dashboard', icon: FiGrid },
    { to: '/meu-perfil', label: 'Meu perfil', icon: FiUser },
  ],
}

type SidebarProps = {
  onNavigate?: () => void
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const [user, setUser] = useState(() => authService.getUser())

  useEffect(() => {
    function syncUser() {
      setUser(authService.getUser())
    }
    window.addEventListener(USER_UPDATED_EVENT, syncUser)
    return () => window.removeEventListener(USER_UPDATED_EVENT, syncUser)
  }, [])

  const navItems = useMemo(
    () => (user?.role ? navPorRole[user.role] : navPorRole.ADMIN),
    [user?.role]
  )
  const displayName = user?.nome?.trim() || user?.username || 'Usuário'
  const roleLabel = user?.role ? ROLE_LABEL[user.role] : 'Usuário'
  const fotoUrl = user?.fotoDePerfil ?? null

  return (
    <aside className="flex h-full w-full flex-col border-r border-[#E5E7EB] bg-white">
      <div className="flex items-center gap-3 border-b border-[#E5E7EB] px-5 py-5 sm:px-6">
        <img src={logo} alt="" className="size-8 shrink-0 sm:size-9" />
        <div className="min-w-0 leading-tight">
          <p className="text-[10px] font-medium uppercase tracking-wide text-[#5D99F4] sm:text-[11px]">
            Hora de
          </p>
          <p className="text-sm font-bold uppercase tracking-wide text-[#1A2D37] sm:text-base">
            Cuidar
          </p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-5 sm:px-4">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition sm:text-[15px] ${
                isActive
                  ? 'bg-[#EBF2FF] font-semibold text-[#5D99F4]'
                  : 'font-medium text-[#8E9AAF] hover:bg-zinc-50 hover:text-[#5A6578]'
              }`
            }
          >
            <Icon className="size-5 shrink-0" aria-hidden />
            <span className="truncate">{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-3 px-3 pb-4 pt-2 sm:px-4 sm:pb-5">
        <LogoutButton onAfterLogout={onNavigate} />

        <NavLink
          to="/meu-perfil"
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-3 py-3 transition ${
              isActive
                ? 'bg-[#EBF2FF] ring-1 ring-[#5D99F4]/30'
                : 'bg-[#F4F6F8] hover:bg-zinc-100'
            }`
          }
        >
          <Avatar
            name={displayName}
            src={fotoUrl}
            className="size-10 text-sm"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-[#1A2D37]">{displayName}</p>
            <p className="truncate text-xs text-[#8E9AAF]">{roleLabel}</p>
          </div>
        </NavLink>
      </div>
    </aside>
  )
}
