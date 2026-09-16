import { useState } from 'react'
import { toast } from 'sonner'
import { Modal, BotaoCancelar, BotaoSalvar } from '@/components/ui'

export type AcaoStatusPrescricaoNutricional = 'ativar' | 'inativar'

type ModalConfirmacaoStatusPrescricaoNutricionalProps = {
  aberto: boolean
  acao: AcaoStatusPrescricaoNutricional
  onFechar: () => void
  onConfirmar: () => Promise<void>
}

const COPY = {
  inativar: {
    titulo: 'Inativar prescrição',
    confirmar: 'Inativar',
    sucesso: 'Prescrição inativada com sucesso.',
    corpo:
      'Tem certeza que deseja inativar esta prescrição? Ela sairá das ativas e passará a aparecer no histórico.',
  },
  ativar: {
    titulo: 'Ativar prescrição',
    confirmar: 'Ativar',
    sucesso: 'Prescrição ativada com sucesso.',
    corpo:
      'Tem certeza que deseja ativar esta prescrição? Ela voltará a aparecer entre as ativas.',
  },
} as const

export function ModalConfirmacaoStatusPrescricaoNutricional({
  aberto,
  acao,
  onFechar,
  onConfirmar,
}: ModalConfirmacaoStatusPrescricaoNutricionalProps) {
  const [loading, setLoading] = useState(false)
  const texto = COPY[acao]

  async function handleConfirmar() {
    setLoading(true)
    try {
      await onConfirmar()
      toast.success(texto.sucesso)
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
      titulo={texto.titulo}
      largura="sm"
      headerTone="blue"
      showCloseButton={true}
      footer={
        <>
          <BotaoCancelar onClick={onFechar} disabled={loading}>
            Cancelar
          </BotaoCancelar>
          <BotaoSalvar onClick={() => void handleConfirmar()} disabled={loading}>
            {texto.confirmar}
          </BotaoSalvar>
        </>
      }
    >
      <div className="flex flex-col gap-4 text-sm text-zinc-600">
        <p>{texto.corpo}</p>
      </div>
    </Modal>
  )
}
