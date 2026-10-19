import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-50 p-4 font-sans">
      <a href="#conteudo-auth" className="skip-link">
        Ir para o formulário
      </a>
      <main id="conteudo-auth" tabIndex={-1} className="w-full max-w-4xl">
        <Outlet />
      </main>
    </div>
  )
}
