import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components'
import type { PacienteDetalhes } from '@/services/paciente.mappers'
import { AbaDadosParticipante } from './AbaDadosParticipante'
import { AbaMedicamentos } from './AbaMedicamentos'
import { AbaAvaliacaoFisica } from '@/components/AvaliacaoFisica'
import { AbaHistoricoRealizacao } from '@/components/HistoricoRealizacao'
import { AbaAlimentacao } from './AbaAlimentacao'
import { AbaExames } from '@/components/Exames/AbaExames'
import { ABAS_PERFIL_PACIENTE } from './perfilPaciente.constants'
import type { AbaPerfil } from './perfilPaciente.types'

type PerfilPacienteAbasProps = {
  paciente: PacienteDetalhes
  usuarioSessao: string
  abaAtiva: AbaPerfil
  onAbaChange: (aba: AbaPerfil) => void
  onPerfilAtualizado?: () => void
  onNovaPrescricao: () => void
  onEditarPrescricao: (prescricaoId: string) => void
  onNovaPrescricaoNutricional: () => void
  onEditarPrescricaoNutricional: (prescricaoId: number) => void
}

export function PerfilPacienteAbas({
  paciente,
  usuarioSessao,
  abaAtiva,
  onAbaChange,
  onPerfilAtualizado,
  onNovaPrescricao,
  onEditarPrescricao,
  onNovaPrescricaoNutricional,
  onEditarPrescricaoNutricional,
}: PerfilPacienteAbasProps) {
  return (
    <Tabs
      value={abaAtiva}
      onValueChange={(value) => onAbaChange(value as AbaPerfil)}
      className="gap-5"
    >
      <TabsList className="border-surface-100">
        {ABAS_PERFIL_PACIENTE.map(({ id, label, Icone }) => (
          <TabsTrigger
            key={id}
            value={id}
            className="inline-flex items-center gap-2"
          >
            <Icone className="size-4 shrink-0" aria-hidden />
            <span>{label}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="dados">
        <AbaDadosParticipante
          paciente={paciente}
          usuarioSessao={usuarioSessao}
          onAtualizado={onPerfilAtualizado}
        />
      </TabsContent>

      <TabsContent value="medicamentos">
        <AbaMedicamentos
          pacienteId={paciente.id}
          onNovaPrescricao={onNovaPrescricao}
          onEditarPrescricao={onEditarPrescricao}
        />
      </TabsContent>

      <TabsContent value="avaliacao">
        <AbaAvaliacaoFisica pacienteId={paciente.id} />
      </TabsContent>

      <TabsContent value="realizacoes">
        <AbaHistoricoRealizacao pacienteId={paciente.id} />
      </TabsContent>

      <TabsContent value="alimentacao">
        <AbaAlimentacao
          pacienteId={paciente.id}
          onNovaPrescricao={onNovaPrescricaoNutricional}
          onEditarPrescricao={onEditarPrescricaoNutricional}
        />
      </TabsContent>

      <TabsContent value="exames">
        <AbaExames pacienteId={paciente.id} nomePaciente={paciente.nome} />
      </TabsContent>
    </Tabs>
  )
}
