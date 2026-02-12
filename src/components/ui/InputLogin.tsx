import { forwardRef, type InputHTMLAttributes } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  error?: string
  leftIcon?: React.ReactNode
  rightSlot?: React.ReactNode
  size?: 'default' | 'compact'
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
      <div className={`flex items-center gap-2 rounded-lg bg-surface-100 ${isCompact ? 'px-3.5 py-2.5' : 'px-4 py-3'}`}>
        {leftIcon && <span className="shrink-0">{leftIcon}</span>}
        <input
          ref={ref}
          id={inputId}
          className={`min-w-0 flex-1 border-0 bg-transparent text-text placeholder:text-text-muted focus:ring-0 focus:outline-none ${isCompact ? 'text-sm' : ''} ${className}`}
          {...rest}
        />
        {rightSlot && <span className="shrink-0">{rightSlot}</span>}
      </div>
      {error && (
        <p className="mt-1 text-sm text-error">
          {error}
        </p>
      )}
    </div>
  )
})
