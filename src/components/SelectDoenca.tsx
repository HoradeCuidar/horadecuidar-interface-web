import { useState, useRef, useEffect } from 'react'

type Option = { value: string; label: string }

type SelectDoencaProps = {
  options: Option[]
  value: string
  onSelect: (value: string) => void
  onAddClick: () => void
  onDeleteClick?: (value: string) => void
}

export function SelectDoenca({ options, value, onSelect, onAddClick, onDeleteClick }: SelectDoencaProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  const selected = options.find((d) => d.value === value)

  useEffect(() => {
    if (!open) return
    setSearchTerm('')
    function handleClickFora(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickFora)
    return () => document.removeEventListener('mousedown', handleClickFora)
  }, [open])

  const filteredOptions = options.filter((d) =>
    d.label.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="relative flex max-w-md flex-col gap-1.5 sm:col-span-2" ref={ref}>
      <label className="block text-left text-sm font-medium text-text">
        Doença
      </label>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-lg bg-surface-100 px-3 py-2.5 text-left text-sm text-text focus:outline-none focus:ring-2 focus:ring-brand-500"
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
          className="absolute left-0 right-0 top-full z-20 mt-1 max-h-64 overflow-hidden rounded-lg border border-surface-200 bg-white py-0.5 shadow-lg flex flex-col"
          role="listbox"
        >
          <div className="flex flex-col gap-2 border-b border-surface-100 p-2.5 bg-white">
            <input
              type="text"
              placeholder="pesquisar doença"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border border-surface-200 px-3 py-2 text-sm text-text placeholder-text-muted focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onAddClick()
                setOpen(false)
              }}
              className="flex items-center justify-center gap-1.5 rounded-md bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600 transition"
            >
              <span>+</span>
              Adicionar Doença
            </button>
          </div>
          <ul className="max-h-40 overflow-y-auto py-0.5 divide-y divide-surface-100">
            {filteredOptions.length === 0 ? (
              <li className="px-3.5 py-3 text-sm text-text-muted">
                Nenhuma doença encontrada
              </li>
            ) : (
              filteredOptions.map((d) => (
                <li
                  key={d.value}
                  className={`flex items-center justify-between px-4 py-1 hover:bg-surface-100 group transition duration-150 ${
                    value === d.value ? 'bg-surface-100 font-medium' : ''
                  }`}
                >
                  <button
                    type="button"
                    role="option"
                    aria-selected={value === d.value}
                    onClick={() => {
                      onSelect(d.value)
                      setOpen(false)
                    }}
                    className="flex-1 py-2 text-left text-sm text-text focus:outline-none"
                  >
                    {d.label}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteClick?.(d.value)
                      setOpen(false)
                    }}
                    className="p-1.5 text-zinc-400 hover:text-red-500 rounded-full hover:bg-red-50 focus:outline-none transition duration-150"
                    title="Excluir doença"
                  >
                    <svg style={{ width: '18px', height: '18px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
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
