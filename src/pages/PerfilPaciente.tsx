import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BotaoVoltar } from '@/components'
import { authService } from '@/services/auth'
import { usePerfilPaciente } from '@/hooks/usePerfilPaciente'
import { CabecalhoPaciente } from '@/components/PerfilPaciente/CabecalhoPaciente'
import { PerfilPacienteAbas } from '@/components/PerfilPaciente/PerfilPacienteAbas'
import { PerfilPacienteSkeleton } from '@/components/PerfilPaciente/PerfilPacienteSkeleton'
import { CLASSE_BOTAO_VOLTAR_PERFIL } from '@/components/PerfilPaciente/perfilPaciente.constants'
import type { AbaPerfil } from '@/components/PerfilPaciente/perfilPaciente.types'

export function PerfilPaciente() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [aba, setAba] = useState<AbaPerfil>('dados')
  const { paciente, loading, erro } = usePerfilPaciente(id)
  const profissionalResponsavel = authService.getUser()?.username ?? '—'

  if (loading) {
    return <PerfilPacienteSkeleton />
  }

  if (erro || !paciente) {
    return (
      <div className="flex flex-col gap-4 px-8 pt-8">
        <BotaoVoltar
          onClick={() => navigate('/pacientes')}
          className={CLASSE_BOTAO_VOLTAR_PERFIL}
        >
          Voltar
        </BotaoVoltar>
        <p className="text-sm text-red-600">{erro ?? 'Paciente não encontrado.'}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5 px-8 pt-8 pb-8">
      <BotaoVoltar
        onClick={() => navigate('/pacientes')}
        className={CLASSE_BOTAO_VOLTAR_PERFIL}
      >
        Voltar
      </BotaoVoltar>

      <CabecalhoPaciente
        paciente={paciente}
        profissionalResponsavel={profissionalResponsavel}
      />

      <PerfilPacienteAbas
        paciente={paciente}
        profissionalResponsavel={profissionalResponsavel}
        abaAtiva={aba}
        onAbaChange={setAba}
      />
    </div>
  )
}
