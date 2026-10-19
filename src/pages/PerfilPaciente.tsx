import { useState } from 'react'
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom'
import { authService } from '@/services/auth'
import { usePerfilPaciente } from '@/hooks/usePerfilPaciente'
import { CabecalhoPaciente } from '@/components/PerfilPaciente/CabecalhoPaciente'
import { PerfilPacienteAbas } from '@/components/PerfilPaciente/PerfilPacienteAbas'
import { PerfilPacienteSkeleton } from '@/components/PerfilPaciente/PerfilPacienteSkeleton'
import type { AbaPerfil } from '@/components/PerfilPaciente/perfilPaciente.types'

const focoLink =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700'

export function PerfilPaciente() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const abaInicial =
    (location.state as { aba?: AbaPerfil } | null)?.aba ?? 'dados'
  const [aba, setAba] = useState<AbaPerfil>(abaInicial)
  const { paciente, loading, erro, recarregar } = usePerfilPaciente(id)
  const usuarioSessao = authService.getUser()?.username ?? '—'

  if (loading) {
    return <PerfilPacienteSkeleton />
  }

  if (erro || !paciente) {
    return (
      <div className="flex flex-col gap-4 px-4 pt-6 sm:px-6 lg:px-8 lg:pt-8">
        <nav className="text-xs text-text-muted" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link to="/home" className={`font-medium text-brand-700 hover:text-brand-800 ${focoLink}`}>
                Início
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link
                to="/pacientes"
                className={`font-medium text-brand-700 hover:text-brand-800 ${focoLink}`}
              >
                Participantes
              </Link>
            </li>
          </ol>
        </nav>
        <p className="text-sm text-error-500" role="alert">
          {erro ?? 'Participante não encontrado.'}
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5 px-4 pb-8 pt-5 sm:px-6 sm:pt-6 lg:px-8 lg:pt-8">
      <nav className="text-xs text-text-muted" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link
              to="/home"
              className={`font-medium text-brand-700 transition hover:text-brand-800 ${focoLink}`}
            >
              Início
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link
              to="/pacientes"
              className={`font-medium text-brand-700 transition hover:text-brand-800 ${focoLink}`}
            >
              Participantes
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="max-w-[16rem] truncate font-medium text-text sm:max-w-none">
            {paciente.nome}
          </li>
        </ol>
      </nav>

      <CabecalhoPaciente
        key={paciente.id}
        paciente={paciente}
        usuarioSessao={usuarioSessao}
        onRelatorio={() => navigate(`/pacientes/${id}/relatorios/adesao`)}
      />

      <PerfilPacienteAbas
        paciente={paciente}
        usuarioSessao={usuarioSessao}
        abaAtiva={aba}
        onAbaChange={setAba}
        onPerfilAtualizado={() => void recarregar()}
        onNovaPrescricao={() => navigate(`/pacientes/${id}/prescricoes/nova`)}
        onEditarPrescricao={(prescricaoId) =>
          navigate(`/pacientes/${id}/prescricoes/${prescricaoId}/editar`)
        }
        onNovaPrescricaoNutricional={() =>
          navigate(`/pacientes/${id}/prescricoes-nutricionais/nova`)
        }
        onEditarPrescricaoNutricional={(prescricaoId) =>
          navigate(
            `/pacientes/${id}/prescricoes-nutricionais/${prescricaoId}/editar`
          )
        }
      />
    </div>
  )
}
