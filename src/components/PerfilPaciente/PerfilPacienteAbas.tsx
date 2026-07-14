import { EmptyState, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components'
import type { PacienteDetalhes } from '@/services/paciente.mappers'
import { AbaDadosParticipante } from './AbaDadosParticipante'
import { ABAS_PERFIL_PACIENTE } from './perfilPaciente.constants'
import type { AbaPerfil } from './perfilPaciente.types'

type PerfilPacienteAbasProps = {
  paciente: PacienteDetalhes
  profissionalResponsavel: string
  abaAtiva: AbaPerfil
  onAbaChange: (aba: AbaPerfil) => void
}

function ConteudoEmBreve({ titulo }: { titulo: string }) {
  return (
    <EmptyState
      title={titulo}
      description="Esta seção será implementada em breve."
      className="min-h-0 py-12"
    />
  )
}

export function PerfilPacienteAbas({
  paciente,
  profissionalResponsavel,
  abaAtiva,
  onAbaChange,
}: PerfilPacienteAbasProps) {
  return (
    <Tabs
      value={abaAtiva}
      onValueChange={(value) => onAbaChange(value as AbaPerfil)}
      className="gap-5"
    >
      <TabsList>
        {ABAS_PERFIL_PACIENTE.map(({ id, label }) => (
          <TabsTrigger key={id} value={id}>
            {label}
          </TabsTrigger>
        ))}
      </TabsList>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <TabsContent value="dados">
          <AbaDadosParticipante
            paciente={paciente}
            profissionalResponsavel={profissionalResponsavel}
          />
        </TabsContent>
        <TabsContent value="medicamentos">
          <ConteudoEmBreve titulo="Prescrições de medicamentos" />
        </TabsContent>
        <TabsContent value="alimentacao">
          <ConteudoEmBreve titulo="Prescrições de alimentação" />
        </TabsContent>
        <TabsContent value="exercicios">
          <ConteudoEmBreve titulo="Prescrições de exercícios" />
        </TabsContent>
      </div>
    </Tabs>
  )
}
