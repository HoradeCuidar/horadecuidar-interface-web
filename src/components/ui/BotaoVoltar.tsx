import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type BotaoVoltarProps = ButtonHTMLAttributes<HTMLButtonElement>

export function BotaoVoltar({ className = '', ...props }: BotaoVoltarProps) {
  return (
    <button
      type="button"
      className={cn(
        'h-10 rounded-md border border-brand-500 px-5 text-sm font-semibold text-brand-500 transition hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}