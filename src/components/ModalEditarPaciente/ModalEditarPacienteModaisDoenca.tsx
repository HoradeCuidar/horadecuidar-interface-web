import {
  Modal,
  Input,
  BotaoCancelar,
  ModalConfirmacaoExcluirDoenca,
} from '@/components'

type ModalEditarPacienteModaisDoencaProps = {
  cadastrarAberto: boolean
  novaDoencaNome: string
  onNovaDoencaNomeChange: (valor: string) => void
  onFecharCadastrar: () => void
  onConfirmarCadastrar: () => void
  excluirAberto: boolean
  onFecharExcluir: () => void
  onConfirmarExcluir: () => Promise<void>
  editarAberto: boolean
  editandoNome: string
  onEditandoNomeChange: (valor: string) => void
  onFecharEditar: () => void
  onConfirmarEditar: () => void
}

export function ModalEditarPacienteModaisDoenca({
  cadastrarAberto,
  novaDoencaNome,
  onNovaDoencaNomeChange,
  onFecharCadastrar,
  onConfirmarCadastrar,
  excluirAberto,
  onFecharExcluir,
  onConfirmarExcluir,
  editarAberto,
  editandoNome,
  onEditandoNomeChange,
  onFecharEditar,
  onConfirmarEditar,
}: ModalEditarPacienteModaisDoencaProps) {
  return (
    <>
      <Modal
        aberto={cadastrarAberto}
        onFechar={onFecharCadastrar}
        titulo="Cadastrar Doença"
        largura="sm"
        footer={
          <>
            <BotaoCancelar onClick={onFecharCadastrar} />
            <button
              type="button"
              onClick={onConfirmarCadastrar}
              className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
            >
              Confirmar
            </button>
          </>
        }
      >
        <Input
          size="compact"
          label="Doença"
          placeholder="Insira o nome da doença"
          value={novaDoencaNome}
          onChange={(e) => onNovaDoencaNomeChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              onConfirmarCadastrar()
            }
          }}
        />
      </Modal>

      <ModalConfirmacaoExcluirDoenca
        aberto={excluirAberto}
        onFechar={onFecharExcluir}
        onConfirmar={onConfirmarExcluir}
      />

      <Modal
        aberto={editarAberto}
        onFechar={onFecharEditar}
        titulo="Editar Doença"
        largura="sm"
        footer={
          <>
            <BotaoCancelar onClick={onFecharEditar} />
            <button
              type="button"
              onClick={onConfirmarEditar}
              className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
            >
              Confirmar
            </button>
          </>
        }
      >
        <Input
          size="compact"
          label="Doença"
          placeholder="Insira o nome da doença"
          value={editandoNome}
          onChange={(e) => onEditandoNomeChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              onConfirmarEditar()
            }
          }}
        />
      </Modal>
    </>
  )
}
