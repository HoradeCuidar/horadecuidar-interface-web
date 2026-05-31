import { useState } from 'react'
import { Modal, BotaoCancelar } from '@/components'

type ModalConfirmacaoExcluirDoencaProps = {
  aberto: boolean
  onFechar: () => void
  onConfirmar: () => void | Promise<void>
}

export function ModalConfirmacaoExcluirDoenca({
  aberto,
  onFechar,
  onConfirmar,
}: ModalConfirmacaoExcluirDoencaProps) {
  const [confirmando, setConfirmando] = useState(false)

  async function handleConfirmar() {
    setConfirmando(true)
    try {
      await onConfirmar()
      onFechar()
    } catch {
    } finally {
      setConfirmando(false)
    }
  }

  return (
    <Modal
      aberto={aberto}
      onFechar={onFechar}
      titulo="Excluir doença"
      largura="sm"
      showCloseButton
      footer={
        <>
          <BotaoCancelar onClick={onFechar}>Cancel</BotaoCancelar>
          <button
            type="button"
            onClick={handleConfirmar}
            disabled={confirmando}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition disabled:opacity-50"
          >
            {confirmando ? 'Excluindo...' : 'Excluir'}
          </button>
        </>
      }
    >
      <div className="flex flex-col items-center justify-center p-2 text-center">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-50 text-red-500 mb-4 border border-red-100 shadow-sm">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </div>
        <h3 className="text-base font-bold text-text mb-1">Excluir essa doença?</h3>
        <p className="text-sm text-text-muted">Esta ação não poderá ser desfeita.</p>
      </div>
    </Modal>
  )
}
