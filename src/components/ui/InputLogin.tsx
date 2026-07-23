import { forwardRef, type InputHTMLAttributes } from 'react'

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'value'> & {
  label: string
  value?: string
  size?: 'default' | 'compact'
  error?: string
  leftIcon?: React.ReactNode
  rightSlot?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    id,
    error,
    leftIcon,
    rightSlot,
    size = 'default',
    className = '',
    ...rest
  },
  ref
) {
  const inputId = id ?? label.toLowerCase().replace(/\s/g, '-')
  const isCompact = size === 'compact'

  return (
    <div className="w-full">
      <label
        htmlFor={inputId}
        className={`block text-left font-medium text-text ${isCompact ? 'mb-1.5 text-sm' : 'mb-1.5 text-sm'}`}
      >
        {label}
      </label>
      <div
        className={`flex items-center gap-2 rounded-lg border bg-white transition-colors ${
          error
            ? 'border-error-500'
            : 'border-zinc-300 focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500'
        } ${isCompact ? 'px-3.5 py-2.5' : 'px-4 py-3'}`}
      >
        {leftIcon && <span className="shrink-0 text-text-muted">{leftIcon}</span>}
        <input
          ref={ref}
          id={inputId}
          className={`min-w-0 flex-1 border-0 bg-transparent text-text placeholder:text-sm placeholder:text-text-muted focus:ring-0 focus:outline-none ${isCompact ? 'text-sm' : ''} ${className}`}
          {...rest}
        />
        {rightSlot && <span className="shrink-0 text-text-muted">{rightSlot}</span>}
      </div>
      {error && (
        <p className="mt-1 text-sm text-error">
          {error}
        </p>
      )}
    </div>
  )
})
