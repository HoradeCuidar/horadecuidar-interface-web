import { forwardRef, useImperativeHandle, useRef } from 'react'
import { IMaskInput } from 'react-imask'

type MaskedInputProps = {
  label: string
  id?: string
  error?: string
  leftIcon?: React.ReactNode
  rightSlot?: React.ReactNode
  mask: string
  unmask?: boolean
  value?: string
  defaultValue?: string
  onAccept?: (value: string, maskRef: unknown) => void
  placeholder?: string
  disabled?: boolean
  autoComplete?: string
  className?: string
  size?: 'default' | 'compact'
}

export const MaskedInput = forwardRef<HTMLInputElement, MaskedInputProps>(
  function MaskedInput(
    {
      label,
      id,
      error,
      leftIcon,
      rightSlot,
      mask,
      unmask = true,
      value,
      defaultValue,
      onAccept,
      placeholder,
      disabled,
      autoComplete,
      size = 'default',
      className = '',
    },
    ref
  ) {
    const innerInputRef = useRef<HTMLInputElement>(null)
    useImperativeHandle(ref, () => innerInputRef.current as HTMLInputElement)

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
          <IMaskInput
            inputRef={innerInputRef}
            id={inputId}
            mask={mask}
            unmask={unmask}
            value={value}
            defaultValue={defaultValue}
            onAccept={onAccept}
            placeholder={placeholder}
            disabled={disabled}
            autoComplete={autoComplete}
            className={`min-w-0 flex-1 border-0 bg-transparent text-text placeholder:text-text-muted focus:ring-0 focus:outline-none ${isCompact ? 'text-sm' : ''} ${className}`}
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
  }
)
