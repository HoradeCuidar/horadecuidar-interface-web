import { EmptyState, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components'

import type { PacienteDetalhes } from '@/services/paciente.mappers'

import { AbaDadosParticipante } from './AbaDadosParticipante'

import { AbaMedicamentos } from './AbaMedicamentos'

import { ABAS_PERFIL_PACIENTE } from './perfilPaciente.constants'

import type { AbaPerfil } from './perfilPaciente.types'

type PerfilPacienteAbasProps = {
  paciente: PacienteDetalhes
  profissionalResponsavel: string
  abaAtiva: AbaPerfil
  onAbaChange: (aba: AbaPerfil) => void
  onNovaPrescricao: () => void
  onEditarPrescricao: (prescricaoId: string) => void
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

function PainelAba({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      {children}
    </div>
  )
}

export function PerfilPacienteAbas({
  paciente,
  profissionalResponsavel,
  abaAtiva,
  onAbaChange,
  onNovaPrescricao,
  onEditarPrescricao,
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

      <TabsContent value="dados">
        <PainelAba>
          <AbaDadosParticipante
            paciente={paciente}
            profissionalResponsavel={profissionalResponsavel}
          />
        </PainelAba>
      </TabsContent>

      <TabsContent value="medicamentos">
        <AbaMedicamentos
          pacienteId={paciente.id}
          onNovaPrescricao={onNovaPrescricao}
          onEditarPrescricao={onEditarPrescricao}
        />
      </TabsContent>

      <TabsContent value="alimentacao">
        <PainelAba>
          <ConteudoEmBreve titulo="Prescrições de alimentação" />
        </PainelAba>
      </TabsContent>
    </Tabs>
  )
}
