import { useState, useRef, useEffect } from 'react'

type Option = { value: string; label: string }

type SelectDoencaProps = {
  options: Option[]
  value: string
  onSelect: (value: string) => void
  onAddClick: () => void
}

export function SelectDoenca({ options, value, onSelect, onAddClick }: SelectDoencaProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const selected = options.find((d) => d.value === value)

  useEffect(() => {
    if (!open) return
    function handleClickFora(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickFora)
    return () => document.removeEventListener('mousedown', handleClickFora)
  }, [open])

  return (
    <div className="relative flex max-w-sm flex-col gap-1.5 sm:col-span-2" ref={ref}>
      <label className="block text-left text-sm font-medium text-text">
        Doença
      </label>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-lg bg-surface-100 px-3 py-2 text-left text-sm text-text focus:outline-none focus:ring-2 focus:ring-brand-500"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Selecione uma doença"
      >
        <span className={value ? '' : 'text-text-muted'}>
          {selected?.label ?? 'Selecione uma doença'}
        </span>
        <svg
          className={`h-3.5 w-3.5 shrink-0 text-text-muted transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div
          className="absolute left-0 right-0 top-full z-20 mt-1 max-h-48 overflow-auto rounded-lg border border-surface-200 bg-white py-0.5 shadow-lg"
          role="listbox"
        >
          <div className="flex justify-center border-b border-surface-100 px-2 pb-1.5">
            <button
              type="button"
              onClick={() => {
                onAddClick()
                setOpen(false)
              }}
              className="flex items-center justify-center gap-1.5 rounded-md bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
            >
              <span>+</span>
              Adicionar doença
            </button>
          </div>
          <ul className="max-h-36 overflow-auto py-0.5">
            {options.length === 0 ? (
              <li className="px-2.5 py-1.5 text-xs text-text-muted">
                Nenhuma doença cadastrada
              </li>
            ) : (
              options.map((d) => (
                <li key={d.value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={value === d.value}
                    onClick={() => {
                      onSelect(d.value)
                      setOpen(false)
                    }}
                    className={`w-full px-2.5 py-1.5 text-left text-sm hover:bg-surface-100 ${
                      value === d.value ? 'bg-surface-100 font-medium' : ''
                    }`}
                  >
                    {d.label}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
