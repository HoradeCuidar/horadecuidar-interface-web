import { forwardRef, type SelectHTMLAttributes } from 'react'

type SelectOption = { value: string; label: string }

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string
  options: SelectOption[]
  error?: string
  size?: 'default' | 'compact'
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, id, options, error, size = 'default', className = '', ...rest },
  ref
) {
  const selectId = id ?? label.toLowerCase().replace(/\s/g, '-')
  const isCompact = size === 'compact'
  return (
    <div className="w-full">
      <label
        htmlFor={selectId}
        className={`block text-left font-medium text-text ${isCompact ? 'mb-1.5 text-sm' : 'mb-1.5 text-sm'}`}
      >
        {label}
      </label>
      <div className={`rounded-lg bg-surface-100 ${isCompact ? 'px-3.5 py-2.5' : 'px-4 py-3'}`}>
        <select
          ref={ref}
          id={selectId}
          className={`w-full border-0 bg-transparent text-text focus:ring-0 focus:outline-none ${isCompact ? 'text-sm' : ''} ${className}`}
          {...rest}
        >
          <option value="">Selecione...</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      {error && <p className="mt-1 text-sm text-error">{error}</p>}
    </div>
  )
})
