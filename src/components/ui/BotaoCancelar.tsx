import type { ButtonHTMLAttributes } from 'react'

type BotaoCancelarProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: React.ReactNode
}

export function BotaoCancelar({
  children = 'Cancelar',
  type = 'button',
  className = '',
  ...rest
}: BotaoCancelarProps) {
  return (
    <button
      type={type}
      className={`w-auto rounded-lg border border-brand-500 px-4 py-2.5 text-sm font-semibold text-brand-500 transition hover:bg-surface-100 disabled:opacity-50 ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
