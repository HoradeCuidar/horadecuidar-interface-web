import { useMemo } from 'react'
import { NavLink } from 'react-router-dom'
import {
  FiGrid,
  FiUsers,
  FiUser,
  FiBriefcase,
} from 'react-icons/fi'
import { authService } from '@/services'
import { LogoutButton } from '@/components/LogoutButton'
import logo from '@/assets/logo.svg'
import type { Role } from '@/types/auth'

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

function iniciais(nome: string): string {
  const parts = nome.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

type SidebarProps = {
  onNavigate?: () => void
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const user = authService.getUser()
  const navItems = useMemo(
    () => (user?.role ? navPorRole[user.role] : navPorRole.ADMIN),
    [user?.role]
  )
  const displayName = user?.username ?? 'Usuário'
  const roleLabel = user?.role ? ROLE_LABEL[user.role] : 'Usuário'

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

        <div className="flex items-center gap-3 rounded-xl bg-[#F4F6F8] px-3 py-3">
          <div
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#5D99F4] text-sm font-bold text-white"
            aria-hidden
          >
            {iniciais(displayName)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-[#1A2D37]">{displayName}</p>
            <p className="truncate text-xs text-[#8E9AAF]">{roleLabel}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
