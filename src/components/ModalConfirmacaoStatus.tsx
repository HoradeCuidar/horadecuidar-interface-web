import { Modal, BotaoCancelar, BotaoSalvar } from '@/components/ui'
import { toast } from 'sonner'
import { useState } from 'react'
import { profissionalService } from '@/services'

interface ModalConfirmacaoStatusProps {
  aberto: boolean
  onFechar: () => void
  onSucesso: () => void
  profissionalId: number | null
  novoStatus: 'active' | 'inactive' | null
}

export function ModalConfirmacaoStatus({
  aberto,
  onFechar,
  onSucesso,
  profissionalId,
  novoStatus,
}: ModalConfirmacaoStatusProps) {
  const [loading, setLoading] = useState(false)

  const isAtivacao = novoStatus === 'active'
  const titulo = isAtivacao ? 'Ativar Profissional' : 'Inativar Profissional'
  const descricao = isAtivacao
    ? 'Tem certeza que deseja ativar este profissional? Ele voltará a ter acesso ao sistema.'
    : 'Tem certeza que deseja inativar este profissional? Ele perderá o acesso ao sistema temporariamente.'
  const labelBotaoConfirmar = isAtivacao ? 'Ativar' : 'Inativar'

  async function handleConfirmar() {
    if (!profissionalId || !novoStatus) return

    setLoading(true)
    try {
      if (isAtivacao) {
        await profissionalService.ativar(profissionalId)
        toast.success('Profissional ativado com sucesso.')
      } else {
        await profissionalService.inativar(profissionalId)
        toast.success('Profissional inativado com sucesso.')
      }
      onSucesso()
      onFechar()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao alterar o status do profissional.')
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
      footer={
        <>
          <BotaoCancelar onClick={onFechar} disabled={loading}>
            Cancelar
          </BotaoCancelar>
          <BotaoSalvar onClick={handleConfirmar} loading={loading}>
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
