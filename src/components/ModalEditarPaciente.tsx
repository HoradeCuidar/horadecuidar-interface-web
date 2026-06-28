import {
  Modal,
  Steps,
  BotaoCancelar,
  BotaoSalvar,
  BotaoVoltar,
} from '@/components'
import { useEditarPaciente } from '@/hooks/useEditarPaciente'
import { PassoDadosGerais } from '@/components/ModalCadastroPaciente/PassoDadosGerais'
import { PassoEndereco } from '@/components/ModalCadastroPaciente/PassoEndereco'
import { PassoDoencas } from '@/components/ModalCadastroPaciente/PassoDoencas'
import { PassoAcessoEdicao } from './ModalEditarPaciente/PassoAcessoEdicao'
import { ModalEditarPacienteModaisDoenca } from './ModalEditarPaciente/ModalEditarPacienteModaisDoenca'
import { ModalEditarPacienteSkeleton } from './ModalEditarPaciente/ModalEditarPacienteSkeleton'

type ModalEditarPacienteProps = {
  aberto: boolean
  onFechar: () => void
  pacienteId: number | null
  onSucesso: () => void
}

export function ModalEditarPaciente({
  aberto,
  onFechar,
  pacienteId,
  onSucesso,
}: ModalEditarPacienteProps) {
  const {
    passos,
    stepId,
    form,
    setCampo,
    nomeOriginal,
    doencasLista,
    doencasModal,
    setDoencasModal,
    loading,
    salvando,
    currentIndex,
    isLastStep,
    handleFechar,
    handleSubmit,
    irParaPassoAnterior,
    handleCadastrarDoenca,
    handleExcluirDoenca,
    handleEditarDoenca,
  } = useEditarPaciente({ aberto, pacienteId, onFechar, onSucesso })

  return (
    <>
      <Modal
        aberto={aberto}
        onFechar={handleFechar}
        titulo="Editar Paciente"
        subtitulo={nomeOriginal}
        largura="md"
        headerTone="blue"
        footer={
          <>
            <BotaoCancelar onClick={handleFechar} />
            <BotaoVoltar onClick={irParaPassoAnterior} disabled={currentIndex === 0 || loading}>
              Voltar
            </BotaoVoltar>
            <BotaoSalvar
              form="form-edicao-paciente"
              disabled={salvando || loading}
              aria-busy={salvando}
            >
              {isLastStep ? (salvando ? 'Salvando...' : 'Salvar Alterações') : 'Próximo'}
            </BotaoSalvar>
          </>
        }
      >
        {loading ? (
          <ModalEditarPacienteSkeleton />
        ) : (
          <form id="form-edicao-paciente" onSubmit={handleSubmit} className="space-y-4">
            <Steps steps={[...passos]} currentStepId={stepId} />
            <div className="mt-8">
              {stepId === 'dados-gerais' && (
                <PassoDadosGerais
                  nome={form.nome}
                  setNome={setCampo('nome')}
                  dataNascimento={form.dataNascimento}
                  setDataNascimento={setCampo('dataNascimento')}
                  telefone={form.telefone}
                  setTelefone={setCampo('telefone')}
                  genero={form.genero}
                  setGenero={setCampo('genero')}
                  email={form.email}
                  setEmail={setCampo('email')}
                />
              )}
              {stepId === 'endereco' && (
                <PassoEndereco
                  rua={form.rua}
                  setRua={setCampo('rua')}
                  numeroCasa={form.numeroCasa}
                  setNumeroCasa={setCampo('numeroCasa')}
                  bairro={form.bairro}
                  setBairro={setCampo('bairro')}
                  estado={form.estado}
                  setEstado={setCampo('estado')}
                  cidade={form.cidade}
                  setCidade={setCampo('cidade')}
                />
              )}
              {stepId === 'doencas' && (
                <PassoDoencas
                  doencasLista={doencasLista}
                  doencaId={form.doencaId}
                  setDoencaId={setCampo('doencaId')}
                  onAbrirModalCadastrarDoenca={() =>
                    setDoencasModal((prev) => ({ ...prev, cadastrarAberto: true }))
                  }
                  onDeleteDoenca={(id) =>
                    setDoencasModal((prev) => ({ ...prev, excluirAberto: true, excluindoId: id }))
                  }
                  onEditDoenca={(id, nome) =>
                    setDoencasModal((prev) => ({
                      ...prev,
                      editarAberto: true,
                      editandoId: id,
                      editandoNome: nome,
                      editandoNomeOriginal: nome,
                    }))
                  }
                  observacoes={form.observacoes}
                  setObservacoes={setCampo('observacoes')}
                />
              )}
              {stepId === 'acesso' && <PassoAcessoEdicao username={form.username} />}
            </div>
          </form>
        )}
      </Modal>

      <ModalEditarPacienteModaisDoenca
        cadastrarAberto={doencasModal.cadastrarAberto}
        novaDoencaNome={doencasModal.novaDoencaNome}
        onNovaDoencaNomeChange={(valor) =>
          setDoencasModal((prev) => ({ ...prev, novaDoencaNome: valor }))
        }
        onFecharCadastrar={() =>
          setDoencasModal((prev) => ({ ...prev, cadastrarAberto: false, novaDoencaNome: '' }))
        }
        onConfirmarCadastrar={handleCadastrarDoenca}
        excluirAberto={doencasModal.excluirAberto}
        onFecharExcluir={() =>
          setDoencasModal((prev) => ({ ...prev, excluirAberto: false, excluindoId: '' }))
        }
        onConfirmarExcluir={handleExcluirDoenca}
        editarAberto={doencasModal.editarAberto}
        editandoNome={doencasModal.editandoNome}
        onEditandoNomeChange={(valor) =>
          setDoencasModal((prev) => ({ ...prev, editandoNome: valor }))
        }
        onFecharEditar={() =>
          setDoencasModal((prev) => ({
            ...prev,
            editarAberto: false,
            editandoId: '',
            editandoNome: '',
            editandoNomeOriginal: '',
          }))
        }
        onConfirmarEditar={handleEditarDoenca}
      />
    </>
  )
}
