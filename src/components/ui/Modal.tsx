import { useEffect } from 'react'

type ModalProps = {
  aberto: boolean
  onFechar: () => void
  titulo: string
  subtitulo?: string
  children: React.ReactNode
  footer?: React.ReactNode
  largura?: 'sm' | 'md' | 'lg'
  headerTone?: 'default' | 'blue'
}

function getWidthClass(largura: NonNullable<ModalProps['largura']>) {
  if (largura === 'sm') return 'max-w-xl'
  if (largura === 'md') return 'max-w-3xl'
  return 'max-w-5xl'
}

export function Modal({
  aberto,
  onFechar,
  titulo,
  subtitulo,
  children,
  footer,
  largura = 'md',
  headerTone = 'default',
}: ModalProps) {
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

  const headerClass =
    headerTone === 'blue'
      ? 'bg-blue-100/80 border-b border-blue-200'
      : 'bg-white border-b border-surface-200'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onFechar}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-titulo"
    >
      <div
        className={`flex max-h-[95vh] w-full ${getWidthClass(largura)} flex-col rounded-lg bg-white shadow-xl`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`shrink-0 px-8 py-4 ${headerClass}`}>
          <h2 id="modal-titulo" className="font-heading text-lg font-semibold text-text">
            {titulo}
          </h2>
          {subtitulo && <p className="mt-0.5 text-xs text-text-muted">{subtitulo}</p>}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-8 py-5">{children}</div>

        {footer && (
          <div className="shrink-0 flex justify-end gap-3 border-t border-surface-200 px-8 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}