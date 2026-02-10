import type { ButtonHTMLAttributes } from 'react'

type BotaoSalvarProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: React.ReactNode
}

export function BotaoSalvar({
  children = 'Salvar',
  type = 'submit',
  className = '',
  ...rest
}: BotaoSalvarProps) {
  return (
    <button
      type={type}
      className={`w-auto rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:opacity-50 ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
