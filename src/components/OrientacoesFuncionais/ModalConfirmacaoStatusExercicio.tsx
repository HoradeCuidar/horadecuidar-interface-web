import { useState } from 'react'
import { toast } from 'sonner'
import { Modal, BotaoCancelar, BotaoSalvar } from '@/components/ui'
import { orientacaoFuncionalService } from '@/services'

type ModalConfirmacaoStatusExercicioProps = {
  aberto: boolean
  onFechar: () => void
  onSucesso: () => void
  exercicioId: number | null
  nomeExercicio: string
  ativar: boolean
}

export function ModalConfirmacaoStatusExercicio({
  aberto,
  onFechar,
  onSucesso,
  exercicioId,
  nomeExercicio,
  ativar,
}: ModalConfirmacaoStatusExercicioProps) {
  const [loading, setLoading] = useState(false)

  const titulo = ativar ? 'Ativar orientação' : 'Inativar orientação'
  const descricao = ativar
    ? `Tem certeza que deseja ativar "${nomeExercicio}"? Ele voltará a aparecer para os participantes.`
    : `Tem certeza que deseja inativar "${nomeExercicio}"? Ela deixará de aparecer para os participantes, mas permanecerá no catálogo.`
  const labelBotao = ativar ? 'Ativar' : 'Inativar'

  async function handleConfirmar() {
    if (exercicioId == null) return

    setLoading(true)
    try {
      await orientacaoFuncionalService.alterarStatus(exercicioId, ativar)
      toast.success(
        ativar
          ? 'Orientação ativado com sucesso.'
          : 'Orientação inativado com sucesso.'
      )
      onSucesso()
      onFechar()
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Erro ao alterar o status do orientação.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      aberto={aberto}
      onFechar={onFechar}
      titulo={titulo}
      largura="sm"
      headerTone="blue"
      showCloseButton
      footer={
        <>
          <BotaoCancelar onClick={onFechar} disabled={loading}>
            Cancelar
          </BotaoCancelar>
          <BotaoSalvar
            onClick={() => void handleConfirmar()}
            disabled={loading}
          >
            {loading ? 'Salvando...' : labelBotao}
          </BotaoSalvar>
        </>
      }
    >
      <div className="flex flex-col gap-4 text-sm text-zinc-600">
        <p>{descricao}</p>
      </div>
    </Modal>
  )
}
