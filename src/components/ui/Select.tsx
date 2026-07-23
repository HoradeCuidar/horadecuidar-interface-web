import { forwardRef, type SelectHTMLAttributes } from 'react'

type SelectOption = { value: string; label: string }

type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> & {
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
      <div
        className={`rounded-lg border bg-white transition-colors ${
          error
            ? 'border-error-500'
            : 'border-zinc-300 focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500'
        } ${isCompact ? 'px-3 py-2.5' : 'px-4 py-3'}`}
      >
        <select
          ref={ref}
          id={selectId}
          className={`w-full min-w-0 appearance-auto border-0 bg-transparent pr-6 text-text focus:ring-0 focus:outline-none ${isCompact ? 'text-sm' : ''} ${className}`}
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
