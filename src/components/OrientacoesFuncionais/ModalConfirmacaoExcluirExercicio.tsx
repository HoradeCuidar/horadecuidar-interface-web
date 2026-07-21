import { useState } from 'react'
import { toast } from 'sonner'
import { Modal, BotaoCancelar } from '@/components/ui'
import { orientacaoFuncionalService } from '@/services'

type ModalConfirmacaoExcluirExercicioProps = {
  aberto: boolean
  onFechar: () => void
  onSucesso: () => void
  exercicioId: number | null
  nomeExercicio: string
}

export function ModalConfirmacaoExcluirExercicio({
  aberto,
  onFechar,
  onSucesso,
  exercicioId,
  nomeExercicio,
}: ModalConfirmacaoExcluirExercicioProps) {
  const [confirmando, setConfirmando] = useState(false)

  async function handleConfirmar() {
    if (exercicioId == null) return

    setConfirmando(true)
    try {
      await orientacaoFuncionalService.excluir(exercicioId)
      toast.success('Exercício excluído com sucesso.')
      onSucesso()
      onFechar()
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Erro ao excluir o exercício.'
      )
    } finally {
      setConfirmando(false)
    }
  }

  return (
    <Modal
      aberto={aberto}
      onFechar={onFechar}
      titulo="Excluir exercício"
      largura="sm"
      showCloseButton
      footer={
        <>
          <BotaoCancelar onClick={onFechar} disabled={confirmando}>
            Cancelar
          </BotaoCancelar>
          <button
            type="button"
            onClick={() => void handleConfirmar()}
            disabled={confirmando}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
          >
            {confirmando ? 'Excluindo...' : 'Excluir'}
          </button>
        </>
      }
    >
      <div className="flex flex-col items-center justify-center p-2 text-center">
        <div className="mb-4 flex size-16 items-center justify-center rounded-full border border-red-100 bg-red-50 text-red-500 shadow-sm">
          <svg
            className="size-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </div>
        <h3 className="mb-1 text-base font-bold text-text">
          Excluir &quot;{nomeExercicio}&quot;?
        </h3>
        <p className="text-sm text-text-muted">
          Esta ação não poderá ser desfeita. Se o exercício estiver em uso,
          a exclusão será bloqueada — nesse caso, inative-o.
        </p>
      </div>
    </Modal>
  )
}
