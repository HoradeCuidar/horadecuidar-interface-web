import { forwardRef, type InputHTMLAttributes } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
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
    className = '',
    ...rest
  },
  ref
) {
  const inputId = id ?? label.toLowerCase().replace(/\s/g, '-')
  return (
    <div className="w-full">
      <label
        htmlFor={inputId}
        className="mb-1.5 block text-left text-sm font-medium text-text"
      >
        {label}
      </label>
      <div className="flex items-center gap-3 rounded-lg bg-surface-100 px-4 py-3">
        {leftIcon && <span className="shrink-0">{leftIcon}</span>}
        <input
          ref={ref}
          id={inputId}
          className={`min-w-0 flex-1 border-0 bg-transparent text-text placeholder:text-text-muted focus:ring-0 focus:outline-none ${className}`}
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
