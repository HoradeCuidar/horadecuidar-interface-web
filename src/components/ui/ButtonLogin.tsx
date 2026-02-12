import type { ButtonHTMLAttributes } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost'
  children: React.ReactNode
}

export function Button({
  variant = 'primary',
  className = '',
  children,
  ...rest
}: ButtonProps) {
  const base =
    'w-full rounded-lg py-3 font-semibold transition disabled:opacity-50 font-sans'
  const styles =
    variant === 'primary'
      ? 'bg-brand-500 text-text-inverse hover:bg-brand-600'
      : 'bg-transparent'
  return (
    <button className={`${base} ${styles} ${className}`} {...rest}>
      {children}
    </button>
  )
}
