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
      className = '',
    },
    ref
  ) {
    const innerInputRef = useRef<HTMLInputElement>(null)
    useImperativeHandle(ref, () => innerInputRef.current as HTMLInputElement)

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
            className={`min-w-0 flex-1 border-0 bg-transparent text-text placeholder:text-text-muted focus:ring-0 focus:outline-none ${className}`}
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
