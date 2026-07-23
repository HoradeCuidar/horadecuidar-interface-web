import { useEffect, useMemo, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  FiChevronDown,
  FiGrid,
  FiUsers,
  FiUser,
  FiBriefcase,
} from 'react-icons/fi'
import { LuDumbbell } from 'react-icons/lu'
import { authService } from '@/services'
import { LogoutButton } from '@/components/LogoutButton'
import { Avatar } from '@/components'
import logo from '@/assets/logo.svg'
import type { Role } from '@/types/auth'
import { USER_UPDATED_EVENT } from '@/types/auth'

type NavChild = {
  to: string
  label: string
}

type NavLinkItem = {
  kind: 'link'
  to: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

type NavGroupItem = {
  kind: 'group'
  label: string
  icon: React.ComponentType<{ className?: string }>
  matchPrefix: string
  children: NavChild[]
}

type NavItem = NavLinkItem | NavGroupItem

const ROLE_LABEL: Record<Role, string> = {
  ADMIN: 'Administrador',
  PROFISSIONAL_DA_SAUDE: 'Profissional da Saúde',
  PACIENTE: 'Participante',
}

const grupoExercicios: NavGroupItem = {
  kind: 'group',
  label: 'Exercícios',
  icon: LuDumbbell,
  matchPrefix: '/atividades',
  children: [
    { to: '/atividades', label: 'Catálogo' },
    { to: '/atividades/tags', label: 'Tags' },
  ],
}

const navPorRole: Record<Role, NavItem[]> = {
  ADMIN: [
    { kind: 'link', to: '/home', label: 'Dashboard', icon: FiGrid },
    {
      kind: 'link',
      to: '/profissionais',
      label: 'Profissionais',
      icon: FiBriefcase,
    },
    grupoExercicios,
    { kind: 'link', to: '/meu-perfil', label: 'Meu perfil', icon: FiUser },
  ],
  PROFISSIONAL_DA_SAUDE: [
    { kind: 'link', to: '/home', label: 'Dashboard', icon: FiGrid },
    { kind: 'link', to: '/pacientes', label: 'Pacientes', icon: FiUsers },
    grupoExercicios,
    { kind: 'link', to: '/meu-perfil', label: 'Meu perfil', icon: FiUser },
  ],
  PACIENTE: [
    { kind: 'link', to: '/home', label: 'Dashboard', icon: FiGrid },
    { kind: 'link', to: '/meu-perfil', label: 'Meu perfil', icon: FiUser },
  ],
}

const linkClass = (isActive: boolean) =>
  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition sm:text-[15px] ${
    isActive
      ? 'bg-brand-100 font-semibold text-brand-600'
      : 'font-medium text-text-muted hover:bg-surface-100 hover:text-text'
  }`

const childLinkClass = (isActive: boolean) =>
  `rounded-lg px-3 py-2 text-sm transition ${
    isActive
      ? 'bg-brand-100 font-semibold text-brand-600'
      : 'font-medium text-text-muted hover:bg-surface-100 hover:text-text'
  }`

function NavGroup({
  item,
  onNavigate,
}: {
  item: NavGroupItem
  onNavigate?: () => void
}) {
  const location = useLocation()
  const grupoAtivo = location.pathname.startsWith(item.matchPrefix)
  const [aberto, setAberto] = useState(grupoAtivo)

  useEffect(() => {
    if (grupoAtivo) setAberto(true)
  }, [grupoAtivo])

  const Icon = item.icon

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={() => setAberto((v) => !v)}
        aria-expanded={aberto}
        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition sm:text-[15px] ${
          grupoAtivo
            ? 'bg-brand-100 font-semibold text-brand-600'
            : 'font-medium text-text-muted hover:bg-surface-100 hover:text-text'
        }`}
      >
        <Icon className="size-5 shrink-0" aria-hidden />
        <span className="min-w-0 flex-1 truncate">{item.label}</span>
        <FiChevronDown
          className={`size-4 shrink-0 transition-transform ${aberto ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </button>

      {aberto && (
        <div className="ml-4 flex flex-col gap-0.5 border-l border-zinc-200 pl-3">
          {item.children.map((child) => (
            <NavLink
              key={child.to}
              to={child.to}
              end={child.to === '/atividades'}
              onClick={onNavigate}
              className={({ isActive }) => childLinkClass(isActive)}
            >
              {child.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  )
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
    <aside className="flex h-full w-full flex-col border-r border-zinc-200 bg-white">
      <div className="flex items-center gap-3 border-b border-zinc-200 px-5 py-5 sm:px-6">
        <img src={logo} alt="" className="size-8 shrink-0 sm:size-9" />
        <div className="min-w-0 leading-tight">
          <p className="text-[10px] font-medium uppercase tracking-wide text-brand-500 sm:text-[11px]">
            Hora de
          </p>
          <p className="font-heading text-sm font-bold uppercase tracking-tight text-text sm:text-base">
            Cuidar
          </p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-5 sm:px-4">
        {navItems.map((item) =>
          item.kind === 'group' ? (
            <NavGroup key={item.label} item={item} onNavigate={onNavigate} />
          ) : (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={({ isActive }) => linkClass(isActive)}
            >
              <item.icon className="size-5 shrink-0" aria-hidden />
              <span className="truncate">{item.label}</span>
            </NavLink>
          )
        )}
      </nav>

      <div className="mt-auto flex flex-col gap-3 px-3 pb-4 pt-2 sm:px-4 sm:pb-5">
        <LogoutButton onAfterLogout={onNavigate} />

        <NavLink
          to="/meu-perfil"
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-3 py-3 transition ${
              isActive
                ? 'bg-brand-100 ring-1 ring-brand-500/30'
                : 'bg-surface-0 hover:bg-surface-100'
            }`
          }
        >
          <Avatar
            name={displayName}
            src={fotoUrl}
            className="size-10 text-sm"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate font-heading text-sm font-bold tracking-tight text-text">
              {displayName}
            </p>
            <p className="truncate text-xs text-text-muted">{roleLabel}</p>
          </div>
        </NavLink>
      </div>
    </aside>
  )
}
