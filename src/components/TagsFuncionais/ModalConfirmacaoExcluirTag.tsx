import { useState } from 'react'
import { toast } from 'sonner'
import { Modal, BotaoCancelar } from '@/components/ui'
import { tagFuncionalService } from '@/services'

type ModalConfirmacaoExcluirTagProps = {
  aberto: boolean
  onFechar: () => void
  onSucesso: () => void
  tagId: number | null
  nomeTag: string
}

export function ModalConfirmacaoExcluirTag({
  aberto,
  onFechar,
  onSucesso,
  tagId,
  nomeTag,
}: ModalConfirmacaoExcluirTagProps) {
  const [confirmando, setConfirmando] = useState(false)

  async function handleConfirmar() {
    if (tagId == null) return

    setConfirmando(true)
    try {
      await tagFuncionalService.excluir(tagId)
      toast.success('Tag excluída com sucesso.')
      onSucesso()
      onFechar()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Erro ao excluir a tag.'
      )
    } finally {
      setConfirmando(false)
    }
  }

  return (
    <Modal
      aberto={aberto}
      onFechar={onFechar}
      titulo="Excluir tag"
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
            className="rounded-lg bg-error-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-error-700 disabled:opacity-50"
          >
            {confirmando ? 'Excluindo...' : 'Excluir'}
          </button>
        </>
      }
    >
      <div className="flex flex-col items-center justify-center p-2 text-center">
        <div className="mb-4 flex size-16 items-center justify-center rounded-full border border-red-100 bg-red-50 text-error-500 shadow-sm">
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
        <h3 className="mb-1 font-heading text-base font-bold tracking-tight text-text">
          Excluir &quot;{nomeTag}&quot;?
        </h3>
        <p className="text-sm text-text-muted">
          Esta ação não poderá ser desfeita. Se a tag estiver vinculada a
          exercícios, ela será removida mesmo assim.
        </p>
      </div>
    </Modal>
  )
}
