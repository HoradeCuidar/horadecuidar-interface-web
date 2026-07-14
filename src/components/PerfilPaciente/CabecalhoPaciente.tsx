import { Avatar } from '@/components'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { PacienteDetalhes } from '@/services/paciente.mappers'
import { CORES_BADGE_DOENCA } from './perfilPaciente.constants'

type CabecalhoPacienteProps = {
  paciente: PacienteDetalhes
  profissionalResponsavel: string
}

function calcularIdade(dataNascimento?: string): number | null {
  if (!dataNascimento?.trim()) return null
  const [y, m, d] = dataNascimento.split('-').map(Number)
  if (!y || !m || !d) return null
  const hoje = new Date()
  let idade = hoje.getFullYear() - y
  const mesDiff = hoje.getMonth() + 1 - m
  if (mesDiff < 0 || (mesDiff === 0 && hoje.getDate() < d)) idade--
  return idade
}

export function CabecalhoPaciente({ paciente, profissionalResponsavel }: CabecalhoPacienteProps) {
  const idade = calcularIdade(paciente.dataDeNascimento)

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-5">
          <Avatar
            name={paciente.nome}
            className="size-20 text-2xl bg-[#E6EEFF] text-brand-600"
          />
          <div className="flex flex-col gap-1.5">
            <h1 className="font-heading text-xl font-bold text-zinc-800">{paciente.nome}</h1>
            <p className="text-sm text-zinc-500">
              {idade != null && `${idade} anos`}
              {idade != null && ' • '}
              Responsável: {profissionalResponsavel}
            </p>
            {paciente.doencas && paciente.doencas.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-2">
                {paciente.doencas.map((doenca, index) => (
                  <Badge
                    key={doenca.id}
                    variant="outline"
                    className={`rounded-full border px-3 py-1 text-xs font-medium ${CORES_BADGE_DOENCA[index % CORES_BADGE_DOENCA.length]}`}
                  >
                    {doenca.nome}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <Button
          variant="outline"
          className="shrink-0 rounded-xl border-brand-500 text-brand-600 hover:bg-brand-50"
          disabled
          title="Em breve"
        >
          Relatório de adesão
        </Button>
      </div>
    </div>
  )
}
