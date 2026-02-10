import { useNavigate } from 'react-router-dom'
import { authService } from '@/services'
import { IconeSair } from '@/components/icons'

export function LogoutButton() {
  const navigate = useNavigate()

  function handleLogout() {
    authService.logout()
    navigate('/login', { replace: true })
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#4A5568] px-4 py-3 font-medium text-white transition hover:bg-[#2D3748] [&_svg]:shrink-0"
      aria-label="Sair da conta"
    >
      <IconeSair />
      <span>Logout</span>
    </button>
  )
}
