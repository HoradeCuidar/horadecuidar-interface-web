import { useState } from 'react'
import { FiBarChart2, FiUser } from 'react-icons/fi'
import { FotoPerfilUpload } from '@/components/MeuPerfil/FotoPerfilUpload'
import { Button } from '@/components/ui/button'
import type { PacienteDetalhes } from '@/services/paciente.mappers'
import { CORES_BADGE_DOENCA } from './perfilPaciente.constants'
import { calcularIdadeParticipante } from './perfilPaciente.utils'

type CabecalhoPacienteProps = {
  paciente: PacienteDetalhes
  usuarioSessao: string
  onRelatorio?: () => void
}

const focoBotao =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700'

export function CabecalhoPaciente({
  paciente,
  usuarioSessao,
  onRelatorio,
}: CabecalhoPacienteProps) {
  const idade = calcularIdadeParticipante(
    paciente.dataDeNascimento,
    paciente.idade
  )
  const [fotoUrl, setFotoUrl] = useState(paciente.fotoDePerfil ?? null)

  const statusAtivo = (paciente.status ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .includes('ativo')

  return (
    <header className="rounded-2xl border border-surface-100 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 items-start gap-4 sm:gap-5">
          <FotoPerfilUpload
            nome={paciente.nome}
            fotoUrl={fotoUrl}
            usuarioId={paciente.id}
            onFotoAtualizada={setFotoUrl}
          />

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-heading text-xl font-bold tracking-tight text-text sm:text-2xl">
                {paciente.nome}
              </h1>
              {paciente.status ? (
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                    statusAtivo
                      ? 'bg-success/15 text-success-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  <span
                    className={`size-1.5 rounded-full ${
                      statusAtivo ? 'bg-success' : 'bg-red-500'
                    }`}
                    aria-hidden
                  />
                  {statusAtivo ? 'Ativo' : paciente.status}
                </span>
              ) : null}
            </div>

            <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-text-muted">
              {idade != null ? <span>{idade} anos</span> : null}
              {idade != null ? (
                <span className="text-surface-200" aria-hidden>
                  ·
                </span>
              ) : null}
              <span className="inline-flex items-center gap-1.5">
                <FiUser className="size-3.5 shrink-0" aria-hidden />
                Sessão: {usuarioSessao}
              </span>
            </p>

            {paciente.doencas && paciente.doencas.length > 0 ? (
              <ul className="mt-3 flex flex-wrap gap-2" aria-label="Condições">
                {paciente.doencas.map((doenca, index) => {
                  const cor =
                    CORES_BADGE_DOENCA[index % CORES_BADGE_DOENCA.length]
                  return (
                    <li
                      key={doenca.id}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${cor.badge}`}
                    >
                      <span
                        className={`size-1.5 rounded-full ${cor.dot}`}
                        aria-hidden
                      />
                      {doenca.nome}
                    </li>
                  )
                })}
              </ul>
            ) : null}
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className={`shrink-0 gap-2 rounded-xl border-brand-600 text-brand-700 hover:bg-brand-50 ${focoBotao}`}
          onClick={onRelatorio}
          disabled={!onRelatorio}
        >
          <FiBarChart2 className="size-4" aria-hidden />
          Relatório de adesão
        </Button>
      </div>
    </header>
  )
}
