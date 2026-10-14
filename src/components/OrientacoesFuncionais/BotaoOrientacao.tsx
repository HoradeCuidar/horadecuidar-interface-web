import type { ComponentProps } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/** Reutiliza os estados do botão base com as cores já adotadas nos formulários. */
export function BotaoOrientacao({ className, variant = 'default', ...props }: ComponentProps<typeof Button>) {
  return <Button {...props} variant={variant} className={cn(
    'rounded-xl',
    variant === 'default' && 'bg-brand-600 text-white hover:bg-brand-700',
    variant === 'outline' && 'border-brand-200 text-brand-600 hover:bg-brand-50 hover:text-brand-700',
    variant === 'ghost' && 'text-brand-600 hover:bg-brand-50 hover:text-brand-700',
    className,
  )} />
}
