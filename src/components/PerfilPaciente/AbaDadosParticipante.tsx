import type { PacienteDetalhes } from '@/services/paciente.mappers'

type AbaDadosParticipanteProps = {
  paciente: PacienteDetalhes
  profissionalResponsavel: string
}

function formatarData(value?: string): string {
  if (!value?.trim()) return '—'
  const s = value.trim()
  if (s.includes('/')) return s
  const [y, m, d] = s.split('-')
  if (!d || !m || !y) return s
  return `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${y}`
}

function formatarTelefone(value?: string): string {
  if (!value?.trim()) return '—'
  const digits = value.replace(/\D/g, '')
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  }
  return value
}

function CampoInfo({ label, valor }: { label: string; valor: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-zinc-500">{label}</span>
      <span className="text-sm font-medium text-zinc-800">{valor}</span>
    </div>
  )
}

export function AbaDadosParticipante({ paciente, profissionalResponsavel }: AbaDadosParticipanteProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <CampoInfo label="Nome completo" valor={paciente.nome || '—'} />
        <CampoInfo label="Data de nascimento" valor={formatarData(paciente.dataDeNascimento)} />
        <CampoInfo label="Email" valor={paciente.email || '—'} />
        <CampoInfo label="Telefone" valor={formatarTelefone(paciente.telefone)} />
        <CampoInfo label="Usuário" valor={paciente.username || '—'} />
        <CampoInfo label="Profissional responsável" valor={profissionalResponsavel} />
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-zinc-500">Observações gerais</span>
        <div className="rounded-xl bg-zinc-50 px-4 py-3 text-sm text-zinc-700 min-h-[80px]">
          {paciente.observacoes?.trim() || 'Nenhuma observação registrada.'}
        </div>
      </div>
    </div>
  )
}
