import type { ButtonHTMLAttributes } from 'react'
import { FiArrowLeft } from 'react-icons/fi'
import { cn } from '@/lib/utils'

type BotaoVoltarProps = ButtonHTMLAttributes<HTMLButtonElement>

export function BotaoVoltar({ className = '', children, ...props }: BotaoVoltarProps) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex w-fit items-center gap-1.5 text-sm font-medium text-brand-600 transition hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <FiArrowLeft className="size-4 shrink-0" aria-hidden />
      {children ?? 'Voltar'}
    </button>
  )
}
