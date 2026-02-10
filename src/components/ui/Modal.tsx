import { useEffect } from 'react'

type ModalProps = {
  aberto: boolean
  onFechar: () => void
  titulo: string
  children: React.ReactNode
  footer?: React.ReactNode
}

export function Modal({ aberto, onFechar, titulo, children, footer }: ModalProps) {
  useEffect(() => {
    if (!aberto) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onFechar()
    }
    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [aberto, onFechar])

  if (!aberto) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onFechar}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-titulo"
    >
      <div
        className="flex max-h-[95vh] w-full max-w-6xl flex-col rounded-lg bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="shrink-0 px-8 py-3">
          <h2 id="modal-titulo" className="font-heading text-lg font-semibold text-text">
            {titulo}
          </h2>
        </div>
        <div className="flex-1 overflow-hidden px-8 py-4">
          {children}
        </div>
        {footer && (
          <div className="shrink-0 flex justify-end gap-3 px-8 py-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
