import { useState } from 'react'
import { toast } from 'sonner'
import { Modal, BotaoCancelar, BotaoSalvar } from '@/components/ui'

type ModalConfirmacaoEncerrarPrescricaoProps = {
  aberto: boolean
  onFechar: () => void
  onConfirmar: () => Promise<void>
}

export function ModalConfirmacaoEncerrarPrescricao({
  aberto,
  onFechar,
  onConfirmar,
}: ModalConfirmacaoEncerrarPrescricaoProps) {
  const [loading, setLoading] = useState(false)

  async function handleConfirmar() {
    setLoading(true)
    try {
      await onConfirmar()
      toast.success('Prescrição encerrada com sucesso.')
      onFechar()
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Erro ao alterar o status da prescrição.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      aberto={aberto}
      onFechar={onFechar}
      titulo="Encerrar prescrição"
      largura="sm"
      headerTone="blue"
      showCloseButton={true}
      footer={
        <>
          <BotaoCancelar onClick={onFechar} disabled={loading}>
            Cancelar
          </BotaoCancelar>
          <BotaoSalvar onClick={() => void handleConfirmar()} disabled={loading}>
            Encerrar
          </BotaoSalvar>
        </>
      }
    >
      <div className="flex flex-col gap-4 text-sm text-zinc-600">
        <p>
          Tem certeza que deseja encerrar esta prescrição? Ela sairá das ativas e
          passará a aparecer no histórico.
        </p>
      </div>
    </Modal>
  )
}
