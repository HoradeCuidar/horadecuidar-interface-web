import { useState } from 'react'
import { FiEdit2, FiMapPin, FiUser } from 'react-icons/fi'
import { Button } from '@/components/ui/button'
import { ModalEditarPaciente } from '@/components/ModalEditarPaciente'
import type { PacienteDetalhes } from '@/services/paciente.mappers'
import { CORES_BADGE_DOENCA } from './perfilPaciente.constants'
import { calcularIdadeParticipante } from './perfilPaciente.utils'

type AbaDadosParticipanteProps = {
  paciente: PacienteDetalhes
  usuarioSessao: string
  onAtualizado?: () => void
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

function labelGenero(value?: string): string {
  if (!value?.trim()) return '—'
  const upper = value
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
  if (upper.includes('FEMININO') || upper === 'F') return 'Feminino'
  if (upper.includes('MASCULINO') || upper === 'M') return 'Masculino'
  if (upper.includes('NAO_BINARIO') || upper === 'N') return 'Não binário'
  if (upper.includes('OUTRO') || upper === 'O') return 'Outro'
  return value
}

function valorOuTraco(value?: string): string {
  const t = value?.trim()
  return t ? t : '—'
}

function CampoInfo({
  label,
  valor,
  dica,
}: {
  label: string
  valor: string
  dica?: string
}) {
  return (
    <div className="flex flex-col gap-1 rounded-xl bg-surface-0 px-3.5 py-3">
      <dt className="text-[11px] font-semibold uppercase tracking-wide text-text-muted">
        {label}
      </dt>
      <dd className="text-sm font-semibold break-words text-text">{valor}</dd>
      {dica ? <p className="text-[11px] text-text-muted">{dica}</p> : null}
    </div>
  )
}

function SecaoCard({
  titulo,
  icone,
  children,
}: {
  titulo: string
  icone: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="rounded-2xl border border-surface-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2.5">
        <span className="flex size-9 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
          {icone}
        </span>
        <h3 className="font-heading text-sm font-semibold text-text">{titulo}</h3>
      </div>
      {children}
    </section>
  )
}

export function AbaDadosParticipante({
  paciente,
  usuarioSessao,
  onAtualizado,
}: AbaDadosParticipanteProps) {
  const [modalEditarAberto, setModalEditarAberto] = useState(false)

  const idade = calcularIdadeParticipante(
    paciente.dataDeNascimento,
    paciente.idade
  )

  const dataNascimento = formatarData(paciente.dataDeNascimento)
  const dataComIdade =
    idade != null ? `${dataNascimento} (${idade} anos)` : dataNascimento

  const municipio = [paciente.cidade, paciente.estado]
    .filter(Boolean)
    .join(' - ')

  const endereco = [
    paciente.rua,
    paciente.numeroDaCasa && `nº ${paciente.numeroDaCasa}`,
    paciente.bairro,
  ]
    .filter(Boolean)
    .join(', ')

  const statusAtivo = (paciente.status ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .includes('ativo')

  const observacoes =
    paciente.observacoes?.trim() || 'Nenhuma observação registrada.'

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-base font-semibold text-text">
            Informações cadastrais e clínicas
          </h2>
          <p className="mt-0.5 text-xs text-text-muted">
            Dados do cadastro, contato e condições acompanhadas
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="shrink-0 border-brand-700 text-brand-700 hover:bg-brand-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
          onClick={() => setModalEditarAberto(true)}
        >
          <FiEdit2 aria-hidden />
          Editar dados
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SecaoCard
          titulo="Identificação e dados pessoais"
          icone={<FiUser className="size-4" aria-hidden />}
        >
          <dl className="grid gap-3 sm:grid-cols-2">
            <CampoInfo
              label="Nome completo"
              valor={valorOuTraco(paciente.nome)}
            />
            <CampoInfo
              label="Data de nascimento"
              valor={dataComIdade}
            />
            <CampoInfo label="Gênero" valor={labelGenero(paciente.genero)} />
            <CampoInfo
              label="Usuário no aplicativo"
              valor={
                paciente.username ? `@${paciente.username}` : '—'
              }
            />
          </dl>
        </SecaoCard>

        <SecaoCard
          titulo="Contato e endereço"
          icone={<FiMapPin className="size-4" aria-hidden />}
        >
          <dl className="grid gap-3">
            <CampoInfo label="E-mail" valor={valorOuTraco(paciente.email)} />
            <CampoInfo
              label="Telefone / WhatsApp"
              valor={formatarTelefone(paciente.telefone)}
            />
            <CampoInfo
              label="Município / região"
              valor={valorOuTraco(municipio)}
            />
            <CampoInfo label="Endereço" valor={valorOuTraco(endereco)} />
            <div className="rounded-xl border border-brand-100 bg-brand-50/60 px-3.5 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-700">
                Usuário da sessão atual
              </p>
              <p className="mt-1 text-sm font-semibold text-text">
                {usuarioSessao}
              </p>
              <p className="text-[11px] text-text-muted">
                Conta logada neste navegador — não é o vínculo do participante
              </p>
            </div>
          </dl>
        </SecaoCard>
      </div>

      <section className="rounded-2xl border border-surface-100 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-heading text-sm font-semibold text-text">
            Condições e observações clínicas
          </h3>
          {paciente.status ? (
            <span
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                statusAtivo
                  ? 'bg-success/15 text-success-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              Status: {statusAtivo ? 'Ativo' : valorOuTraco(paciente.status)}
            </span>
          ) : null}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-text-muted">
              Condições diagnosticadas
            </p>
            {paciente.doencas && paciente.doencas.length > 0 ? (
              <ul className="flex flex-col gap-2">
                {paciente.doencas.map((doenca, index) => {
                  const cor =
                    CORES_BADGE_DOENCA[index % CORES_BADGE_DOENCA.length]
                  return (
                    <li
                      key={doenca.id}
                      className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm font-medium ${cor.badge}`}
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
            ) : (
              <p className="rounded-xl bg-surface-0 px-3.5 py-3 text-sm text-text-muted">
                Nenhuma condição cadastrada.
              </p>
            )}
          </div>

          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-text-muted">
              Observações gerais do prontuário
            </p>
            <div className="min-h-[8rem] rounded-xl bg-surface-0 px-4 py-3 text-sm leading-relaxed text-text">
              {observacoes}
            </div>
          </div>
        </div>
      </section>

      <ModalEditarPaciente
        aberto={modalEditarAberto}
        onFechar={() => setModalEditarAberto(false)}
        pacienteId={paciente.id}
        onSucesso={() => {
          setModalEditarAberto(false)
          onAtualizado?.()
        }}
      />
    </div>
  )
}
