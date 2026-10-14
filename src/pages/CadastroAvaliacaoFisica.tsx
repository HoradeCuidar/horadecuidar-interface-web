import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { BotaoVoltar } from '@/components'
import { FormularioAvaliacaoFisica } from '@/components/AvaliacaoFisica'
import { usePerfilPaciente } from '@/hooks/usePerfilPaciente'
import { avaliacaoFisicaService } from '@/services'
import type { AvaliacaoFisicaRequest } from '@/services/avaliacaoFisica.types'

export function CadastroAvaliacaoFisica() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [salvando, setSalvando] = useState(false)
  const pacienteId = Number(id)
  const { paciente } = usePerfilPaciente(id)

  function voltar() {
    navigate(`/pacientes/${id}`, { state: { aba: 'avaliacao' } })
  }

  if (!id || Number.isNaN(pacienteId)) {
    return (
      <div className="px-4 pt-4 sm:px-6 lg:px-8">
        <p className="text-sm text-error-500" role="alert">
          Participante inválido.
        </p>
      </div>
    )
  }

  async function handleSubmit(dados: AvaliacaoFisicaRequest) {
    setSalvando(true)
    try {
      await avaliacaoFisicaService.criar(pacienteId, dados)
      toast.success('Avaliação física cadastrada com sucesso.')
      voltar()
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Erro ao cadastrar avaliação.'
      )
    } finally {
      setSalvando(false)
    }
  }

  const nomeComIdade =
    paciente?.nome &&
    [
      paciente.nome,
      paciente.idade != null ? `(${paciente.idade} anos)` : null,
    ]
      .filter(Boolean)
      .join(' ')

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 pt-4 sm:px-6 sm:pt-6 lg:px-8">
        <BotaoVoltar onClick={voltar}>Voltar</BotaoVoltar>
        <nav className="text-xs text-text-muted" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link
                to="/pacientes"
                className="font-medium text-brand-700 hover:text-brand-800"
              >
                Participantes
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link
                to={`/pacientes/${id}`}
                state={{ aba: 'avaliacao' }}
                className="font-medium text-brand-700 hover:text-brand-800"
              >
                Ficha clínica
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="font-medium text-text">Nova avaliação</li>
          </ol>
        </nav>
      </div>
      <main className="mt-3 flex-1 overflow-y-auto p-4 sm:mt-4 sm:p-6 lg:p-8">
        <div className="mx-auto w-full max-w-3xl">
          <FormularioAvaliacaoFisica
            titulo="Nova avaliação física"
            descricaoPagina="Registre os dados da avaliação física do participante."
            labelSalvar="Salvar avaliação"
            nomeParticipante={nomeComIdade || paciente?.nome}
            salvando={salvando}
            onSubmit={handleSubmit}
            onCancelar={voltar}
          />
        </div>
      </main>
    </div>
  )
}
