import { useNavigate } from 'react-router-dom'
import { FiLogOut } from 'react-icons/fi'
import { authService } from '@/services'

type LogoutButtonProps = {
  className?: string
  onAfterLogout?: () => void
}

export function LogoutButton({ className = '', onAfterLogout }: LogoutButtonProps) {
  const navigate = useNavigate()

  function handleLogout() {
    authService.logout()
    onAfterLogout?.()
    navigate('/login', { replace: true })
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={`flex w-full items-center gap-2.5 rounded-xl bg-[#FDECEC] px-3 py-2.5 text-sm font-semibold text-[#D46565] transition hover:bg-[#FAD4D4] hover:text-[#C65555] ${className}`}
      aria-label="Sair da conta"
    >
      <FiLogOut className="size-5 shrink-0" aria-hidden />
      <span>Sair</span>
    </button>
  )
}
