import { useEffect } from 'react'
import { IconeFechar } from '@/components/icons'

type ModalProps = {
  aberto: boolean
  onFechar: () => void
  titulo: string
  subtitulo?: string
  children: React.ReactNode
  footer?: React.ReactNode
  largura?: 'sm' | 'md' | 'lg'
  altura?: 'default' | 'tall'
  headerTone?: 'default' | 'blue'
  showCloseButton?: boolean
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
  altura = 'default',
  headerTone = 'default',
  showCloseButton = false,
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
        className={`flex max-h-[95vh] w-full ${getWidthClass(largura)} ${altura === 'tall' ? 'min-h-[min(560px,calc(100vh-2rem))]' : ''} flex-col overflow-hidden rounded-2xl bg-white shadow-xl`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`shrink-0 flex items-start justify-between gap-2 px-8 py-4 ${headerClass}`}>
          <div className="min-w-0">
            <h2 id="modal-titulo" className="font-heading text-lg font-semibold text-text">
              {titulo}
            </h2>
            {subtitulo && <p className="mt-0.5 text-xs text-text-muted">{subtitulo}</p>}
          </div>
          {showCloseButton && (
            <button
              type="button"
              onClick={onFechar}
              className="shrink-0 rounded-full p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
              aria-label="Fechar"
            >
              <IconeFechar />
            </button>
          )}
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