import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { BotaoVoltar } from '@/components'
import { usePerfilPaciente } from '@/hooks/usePerfilPaciente'
import {
  FormularioPrescricaoNutricional,
  criarAlimentoVazio,
  criarFormularioVazio,
  criarOpcaoVazia,
  criarRefeicaoVazia,
  type AlimentoForm,
  type OpcaoRefeicaoForm,
  type PrescricaoNutricionalFormData,
  type RefeicaoForm,
} from '@/components/PrescricaoNutricional'
import { prescricaoNutricionalService } from '@/services'
import { validarPrescricaoNutricionalForm } from '@/services/prescricaoNutricional.mappers'

export function CadastroPrescricaoNutricional() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { paciente, loading, erro } = usePerfilPaciente(id)
  const [salvando, setSalvando] = useState(false)
  const [form, setForm] = useState<PrescricaoNutricionalFormData>(
    criarFormularioVazio()
  )

  useEffect(() => {
    if (paciente?.nome) {
      setForm((prev) => ({ ...prev, nomeParticipante: paciente.nome }))
    }
  }, [paciente?.nome])

  function voltarParaPerfil() {
    navigate(`/pacientes/${id}`, { state: { aba: 'alimentacao' } })
  }

  function handleChangeCampo<
    K extends keyof Omit<PrescricaoNutricionalFormData, 'refeicoes'>,
  >(campo: K, valor: PrescricaoNutricionalFormData[K]) {
    setForm((prev) => ({ ...prev, [campo]: valor }))
  }

  function handleChangeRefeicao(
    refeicaoId: string,
    campo: keyof Omit<RefeicaoForm, 'id' | 'opcoes'>,
    valor: string
  ) {
    setForm((prev) => ({
      ...prev,
      refeicoes: prev.refeicoes.map((r) =>
        r.id === refeicaoId ? { ...r, [campo]: valor } : r
      ),
    }))
  }

  function handleChangeOpcao(
    refeicaoId: string,
    opcaoId: string,
    campo: keyof Omit<OpcaoRefeicaoForm, 'id' | 'alimentos'>,
    valor: string
  ) {
    setForm((prev) => ({
      ...prev,
      refeicoes: prev.refeicoes.map((r) =>
        r.id !== refeicaoId
          ? r
          : {
              ...r,
              opcoes: r.opcoes.map((o) =>
                o.id === opcaoId ? { ...o, [campo]: valor } : o
              ),
            }
      ),
    }))
  }

  function handleChangeAlimento(
    refeicaoId: string,
    opcaoId: string,
    alimentoId: string,
    campo: keyof AlimentoForm,
    valor: string
  ) {
    setForm((prev) => ({
      ...prev,
      refeicoes: prev.refeicoes.map((r) =>
        r.id !== refeicaoId
          ? r
          : {
              ...r,
              opcoes: r.opcoes.map((o) =>
                o.id !== opcaoId
                  ? o
                  : {
                      ...o,
                      alimentos: o.alimentos.map((a) =>
                        a.id === alimentoId ? { ...a, [campo]: valor } : a
                      ),
                    }
              ),
            }
      ),
    }))
  }

  function handleAdicionarRefeicao() {
    setForm((prev) => ({
      ...prev,
      refeicoes: [
        ...prev.refeicoes,
        criarRefeicaoVazia(prev.refeicoes.length + 1),
      ],
    }))
  }

  function handleRemoverRefeicao(refeicaoId: string) {
    setForm((prev) => ({
      ...prev,
      refeicoes: prev.refeicoes.filter((r) => r.id !== refeicaoId),
    }))
  }

  function handleAdicionarOpcao(refeicaoId: string) {
    setForm((prev) => ({
      ...prev,
      refeicoes: prev.refeicoes.map((r) =>
        r.id !== refeicaoId
          ? r
          : {
              ...r,
              opcoes: [...r.opcoes, criarOpcaoVazia(r.opcoes.length + 1)],
            }
      ),
    }))
  }

  function handleRemoverOpcao(refeicaoId: string, opcaoId: string) {
    setForm((prev) => ({
      ...prev,
      refeicoes: prev.refeicoes.map((r) =>
        r.id !== refeicaoId
          ? r
          : { ...r, opcoes: r.opcoes.filter((o) => o.id !== opcaoId) }
      ),
    }))
  }

  function handleAdicionarAlimento(refeicaoId: string, opcaoId: string) {
    setForm((prev) => ({
      ...prev,
      refeicoes: prev.refeicoes.map((r) =>
        r.id !== refeicaoId
          ? r
          : {
              ...r,
              opcoes: r.opcoes.map((o) =>
                o.id !== opcaoId
                  ? o
                  : { ...o, alimentos: [...o.alimentos, criarAlimentoVazio()] }
              ),
            }
      ),
    }))
  }

  function handleRemoverAlimento(
    refeicaoId: string,
    opcaoId: string,
    alimentoId: string
  ) {
    setForm((prev) => ({
      ...prev,
      refeicoes: prev.refeicoes.map((r) =>
        r.id !== refeicaoId
          ? r
          : {
              ...r,
              opcoes: r.opcoes.map((o) =>
                o.id !== opcaoId
                  ? o
                  : {
                      ...o,
                      alimentos: o.alimentos.filter((a) => a.id !== alimentoId),
                    }
              ),
            }
      ),
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const erroValidacao = validarPrescricaoNutricionalForm(form)
    if (erroValidacao) {
      toast.error(erroValidacao)
      return
    }

    if (!id) {
      toast.error('Paciente inválido.')
      return
    }

    setSalvando(true)
    try {
      await prescricaoNutricionalService.criar(Number(id), form)
      toast.success('Prescrição nutricional salva com sucesso.')
      voltarParaPerfil()
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Erro ao salvar a prescrição.'
      )
    } finally {
      setSalvando(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <p className="text-sm text-text-muted">Carregando...</p>
      </div>
    )
  }

  if (erro || !paciente) {
    return (
      <div className="flex flex-col gap-4 px-8 pt-8">
        <BotaoVoltar onClick={() => navigate('/pacientes')}>Voltar</BotaoVoltar>
        <p className="text-sm text-red-600">{erro ?? 'Paciente não encontrado.'}</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="px-4 pt-4 sm:px-6 sm:pt-6 lg:px-8">
        <BotaoVoltar onClick={voltarParaPerfil}>Voltar</BotaoVoltar>
      </div>

      <div className="mt-3 flex min-h-0 flex-1 overflow-y-auto p-4 sm:mt-4 sm:p-6 lg:p-8">
        <div className="mx-auto w-full max-w-3xl">
          <FormularioPrescricaoNutricional
            form={form}
            onChangeCampo={handleChangeCampo}
            onChangeRefeicao={handleChangeRefeicao}
            onChangeOpcao={handleChangeOpcao}
            onChangeAlimento={handleChangeAlimento}
            onAdicionarRefeicao={handleAdicionarRefeicao}
            onRemoverRefeicao={handleRemoverRefeicao}
            onAdicionarOpcao={handleAdicionarOpcao}
            onRemoverOpcao={handleRemoverOpcao}
            onAdicionarAlimento={handleAdicionarAlimento}
            onRemoverAlimento={handleRemoverAlimento}
            onSubmit={handleSubmit}
            onCancelar={voltarParaPerfil}
            salvando={salvando}
          />
        </div>
      </div>
    </div>
  )
}
