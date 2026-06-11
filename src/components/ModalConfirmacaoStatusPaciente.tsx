import { Modal, BotaoCancelar, BotaoSalvar } from '@/components/ui'
import { toast } from 'sonner'
import { useState } from 'react'
import { pacienteService } from '@/services'

interface ModalConfirmacaoStatusPacienteProps {
  aberto: boolean
  onFechar: () => void
  onSucesso: () => void
  pacienteId: number | null
  novoStatus: 'active' | 'inactive' | null
}

export function ModalConfirmacaoStatusPaciente({
  aberto,
  onFechar,
  onSucesso,
  pacienteId,
  novoStatus,
}: ModalConfirmacaoStatusPacienteProps) {
  const [loading, setLoading] = useState(false)

  const isAtivacao = novoStatus === 'active'
  const titulo = isAtivacao ? 'Ativar Paciente' : 'Inativar Paciente'
  const descricao = isAtivacao
    ? 'Tem certeza que deseja ativar este paciente? O monitoramento e acompanhamento dele voltarão a ficar ativos.'
    : 'Tem certeza que deseja inativar este paciente? O monitoramento e acompanhamento dele serão pausados temporariamente.'
  const labelBotaoConfirmar = isAtivacao ? 'Ativar' : 'Inativar'

  async function handleConfirmar() {
    if (!pacienteId || !novoStatus) return

    setLoading(true)
    try {
      await pacienteService.alterarStatus(pacienteId)
      toast.success(isAtivacao ? 'Paciente ativado com sucesso.' : 'Paciente inativado com sucesso.')
      onSucesso()
      onFechar()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao alterar o status do paciente.')
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
      showCloseButton={true}
      footer={
        <>
          <BotaoCancelar onClick={onFechar} disabled={loading}>
            Cancelar
          </BotaoCancelar>
          <BotaoSalvar onClick={handleConfirmar} disabled={loading}>
            {labelBotaoConfirmar}
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
