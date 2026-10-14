import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import {
  FiActivity,
  FiCheckCircle,
  FiEdit2,
  FiEye,
  FiSlash,
  FiAlertTriangle,
  FiUsers,
} from 'react-icons/fi'
import {
  EmptyState,
  ButtonCadastro,
  ModalCadastroPaciente,
  ModalEditarPaciente,
  ModalConfirmacaoStatusPaciente,
  DataTable,
  InputBusca,
  Skeleton,
} from '@/components'
import emptyPacienteSvg from '@/assets/empty-paciente.svg'
import { pacienteService } from '@/services/paciente'
import { EmptyPesquisar } from '@/components/illustrations/EmptyPesquisar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { ColumnDef } from '@/components/DataTable'

type StatusParticipante = 'active' | 'inactive'

type DoencaLista = { id: number; nome: string }

export type ParticipanteLista = {
  id: number
  nome: string
  telefone: string
  email: string
  status: StatusParticipante
  classificacao?: string | null
  doencas: DoencaLista[]
}

function mapItem(it: Record<string, unknown>): ParticipanteLista {
  const statusRaw = String(it.status ?? '')
  return {
    id: Number(it.id),
    nome: String(it.nome ?? ''),
    telefone: String(it.telefone ?? ''),
    email: String(it.email ?? ''),
    status: statusRaw.toLowerCase().startsWith('a') ? 'active' : 'inactive',
    classificacao:
      typeof it.classificacao === 'string' ? it.classificacao : null,
    doencas: Array.isArray(it.doencas)
      ? (it.doencas as DoencaLista[]).map((d) => ({
          id: Number(d.id),
          nome: String(d.nome ?? ''),
        }))
      : [],
  }
}

function labelClassificacao(classificacao?: string | null): {
  texto: string
  tom: string
} {
  switch (classificacao) {
    case 'BAIXA_ADESAO':
      return { texto: 'Baixa adesão', tom: 'bg-red-100 text-red-700' }
    case 'ATENCAO':
      return { texto: 'Atenção', tom: 'bg-orange-100 text-orange-700' }
    case 'ADEQUADA':
      return { texto: 'Adesão adequada', tom: 'bg-success/15 text-success-700' }
    case 'DADOS_INSUFICIENTES':
      return {
        texto: 'Dados insuficientes',
        tom: 'bg-surface-0 text-text-muted',
      }
    default:
      return { texto: 'Sem classificação', tom: 'bg-surface-0 text-text-muted' }
  }
}

function iniciais(nome: string): string {
  return nome
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join('')
}

function CartaoResumo({
  titulo,
  valor,
  detalhe,
  Icone,
  tom,
}: {
  titulo: string
  valor: number
  detalhe: string
  Icone: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>
  tom: 'brand' | 'sucesso' | 'alerta'
}) {
  const tons = {
    brand: 'bg-brand-100 text-brand-700',
    sucesso: 'bg-success/15 text-success-700',
    alerta: 'bg-red-100 text-red-700',
  }

  return (
    <article className="flex items-center gap-4 rounded-2xl border border-surface-100 bg-white px-5 py-4 shadow-sm">
      <span
        className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${tons[tom]}`}
      >
        <Icone className="size-5" aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-text-muted">
          {titulo}
        </p>
        <p className="mt-0.5 font-heading text-2xl font-bold text-text">
          {valor.toLocaleString('pt-BR')}
        </p>
        <p className="mt-0.5 text-xs text-text-muted">{detalhe}</p>
      </div>
    </article>
  )
}

export function Pacientes() {
  const navigate = useNavigate()
  const [modalCadastroAberto, setModalCadastroAberto] = useState(false)
  const [termoBusca, setTermoBusca] = useState('')
  const [participantes, setParticipantes] = useState<ParticipanteLista[]>([])
  const [loading, setLoading] = useState(true)
  const [jaTeveParticipantes, setJaTeveParticipantes] = useState(false)
  const buscaTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [confirmacaoStatusAberto, setConfirmacaoStatusAberto] = useState(false)
  const [participanteAcaoId, setParticipanteAcaoId] = useState<number | null>(
    null
  )
  const [novoStatusAcao, setNovoStatusAcao] = useState<StatusParticipante | null>(
    null
  )
  const [modalEditarAberto, setModalEditarAberto] = useState(false)
  const [participanteEditarId, setParticipanteEditarId] = useState<number | null>(
    null
  )

  const resumo = useMemo(() => {
    const total = participantes.length
    const ativos = participantes.filter((p) => p.status === 'active').length
    const baixaAdesao = participantes.filter(
      (p) => p.classificacao === 'BAIXA_ADESAO'
    ).length
    const pctAtivos =
      total > 0 ? ((ativos / total) * 100).toLocaleString('pt-BR', {
        maximumFractionDigits: 1,
      }) : '0'
    return { total, ativos, baixaAdesao, pctAtivos }
  }, [participantes])

  const columns: ColumnDef<ParticipanteLista>[] = [
    {
      header: 'Nome do participante',
      headerClassName: 'text-left text-xs font-bold uppercase tracking-wide text-text',
      className: 'py-4 text-left',
      render: (item) => (
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700">
            {iniciais(item.nome)}
          </span>
          <p className="min-w-0 truncate font-heading text-sm font-semibold text-text">
            {item.nome}
          </p>
        </div>
      ),
    },
    {
      header: 'Contato',
      headerClassName: 'text-left text-xs font-bold uppercase tracking-wide text-text',
      className: 'py-4 text-left',
      render: (item) => (
        <div className="min-w-0 space-y-0.5">
          <p className="truncate text-sm text-text">
            {item.telefone || '—'}
          </p>
          <p className="truncate text-[11px] text-text-muted">
            {item.email || 'Sem e-mail'}
          </p>
        </div>
      ),
    },
    {
      header: 'Condições clínicas',
      headerClassName: 'text-left text-xs font-bold uppercase tracking-wide text-text',
      className: 'py-4 text-left',
      render: (item) =>
        item.doencas.length === 0 ? (
          <span className="text-sm text-text-muted">—</span>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {item.doencas.slice(0, 3).map((d) => (
              <span
                key={d.id}
                className="rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-medium text-brand-700"
              >
                {d.nome}
              </span>
            ))}
            {item.doencas.length > 3 ? (
              <span className="rounded-full bg-surface-0 px-2.5 py-0.5 text-[11px] font-medium text-text-muted">
                +{item.doencas.length - 3}
              </span>
            ) : null}
          </div>
        ),
    },
    {
      header: 'Status / adesão',
      headerClassName: 'text-left text-xs font-bold uppercase tracking-wide text-text',
      className: 'py-4 text-left',
      render: (item) => {
        const classe = labelClassificacao(item.classificacao)
        return (
          <div className="flex flex-col items-start gap-1.5">
            <Badge
              className={`rounded-full border-0 px-3 py-1 text-[11px] font-semibold text-white ${
                item.status === 'active' ? 'bg-success-500' : 'bg-error-500'
              }`}
            >
              {item.status === 'active' ? 'Ativo' : 'Inativo'}
            </Badge>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${classe.tom}`}
            >
              {classe.texto}
            </span>
          </div>
        )
      },
    },
    {
      header: 'Ações',
      headerClassName: 'text-center text-xs font-bold uppercase tracking-wide text-text',
      className: 'py-4 text-center',
      render: (item) => (
        <div className="flex items-center justify-center gap-0.5">
          {item.status === 'active' ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-error-500 hover:bg-error-500/15 hover:text-error-700"
              title="Inativar"
              aria-label="Inativar participante"
              onClick={() => {
                setParticipanteAcaoId(item.id)
                setNovoStatusAcao('inactive')
                setConfirmacaoStatusAberto(true)
              }}
            >
              <FiSlash className="size-4" aria-hidden />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-success-500 hover:bg-success-500/15 hover:text-success-700"
              title="Ativar"
              aria-label="Ativar participante"
              onClick={() => {
                setParticipanteAcaoId(item.id)
                setNovoStatusAcao('active')
                setConfirmacaoStatusAberto(true)
              }}
            >
              <FiCheckCircle className="size-4" aria-hidden />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-brand-600 hover:bg-brand-100 hover:text-brand-700"
            title="Visualizar"
            aria-label="Visualizar participante"
            onClick={() => navigate(`/pacientes/${item.id}`)}
          >
            <FiEye className="size-4" aria-hidden />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-brand-600 hover:bg-brand-100 hover:text-brand-700"
            title="Editar"
            aria-label="Editar participante"
            onClick={() => {
              setParticipanteEditarId(item.id)
              setModalEditarAberto(true)
            }}
          >
            <FiEdit2 className="size-4" aria-hidden />
          </Button>
        </div>
      ),
    },
  ]

  async function loadParticipantes() {
    setLoading(true)
    try {
      const items = await pacienteService.listar()
      const mapped = items.map((it: Record<string, unknown>) => mapItem(it))
      setParticipantes(mapped)
      if (mapped.length > 0) setJaTeveParticipantes(true)
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : 'Erro ao buscar participantes'
      )
    } finally {
      setLoading(false)
    }
  }

  async function doBusca(termo: string) {
    try {
      const items = await pacienteService.buscar(termo)
      setParticipantes(items.map((it: Record<string, unknown>) => mapItem(it)))
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : 'Erro ao buscar participantes'
      )
    }
  }

  function handleBusca(termo: string) {
    setTermoBusca(termo)
    if (buscaTimeout.current) clearTimeout(buscaTimeout.current)

    if (termo.trim() === '') {
      buscaTimeout.current = setTimeout(() => {
        void loadParticipantes()
      }, 150)
      return
    }

    buscaTimeout.current = setTimeout(() => {
      void doBusca(termo)
    }, 300)
  }

  async function handleSubmitParticipante(dados: Record<string, unknown>) {
    const { conviteEnviado } = await pacienteService.cadastrar(dados)
    if (conviteEnviado) {
      toast.success('Participante cadastrado e convite enviado.')
    } else {
      toast.warning(
        'Participante cadastrado, mas o convite por e-mail falhou. Verifique a configuração de envio.'
      )
    }
    setModalCadastroAberto(false)
    await loadParticipantes()
  }

  useEffect(() => {
    void loadParticipantes()
    return () => {
      if (buscaTimeout.current) clearTimeout(buscaTimeout.current)
    }
  }, [])

  return (
    <div className="flex flex-col px-4 pb-8 pt-6 sm:px-6 lg:px-8 lg:pt-8">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-heading text-2xl font-bold tracking-tight text-text">
              Participantes
            </h1>
            {!loading ? (
              <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-semibold text-brand-700">
                {resumo.total} cadastrados
              </span>
            ) : null}
          </div>
          <p className="mt-1 max-w-2xl text-sm text-text-muted">
            Acompanhe os participantes cadastrados, seus planos de tratamento e
            monitoramentos ativos.
          </p>
        </div>
        {jaTeveParticipantes && !loading ? (
          <ButtonCadastro
            label="Cadastrar participante"
            onClick={() => setModalCadastroAberto(true)}
          />
        ) : null}
      </header>

      {loading ? (
        <div className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 rounded-2xl" />
            ))}
          </div>
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-80 w-full rounded-2xl" />
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {jaTeveParticipantes ? (
            <section
              className="grid gap-4 sm:grid-cols-3"
              aria-label="Resumo dos participantes"
            >
              <CartaoResumo
                titulo="Total de participantes"
                valor={resumo.total}
                detalhe="Na listagem atual"
                Icone={FiUsers}
                tom="brand"
              />
              <CartaoResumo
                titulo="Em acompanhamento ativo"
                valor={resumo.ativos}
                detalhe={`${resumo.pctAtivos}% do total`}
                Icone={FiActivity}
                tom="sucesso"
              />
              <CartaoResumo
                titulo="Com alerta de baixa adesão"
                valor={resumo.baixaAdesao}
                detalhe={
                  resumo.baixaAdesao > 0
                    ? 'Ação prioritária'
                    : 'Nenhum alerta no momento'
                }
                Icone={FiAlertTriangle}
                tom="alerta"
              />
            </section>
          ) : null}

          {jaTeveParticipantes ? (
            <div className="flex w-full items-center gap-4">
              <div className="flex-1">
                <InputBusca
                  value={termoBusca}
                  onChange={(e) => handleBusca(e.target.value)}
                  placeholder="Buscar por nome..."
                />
              </div>
            </div>
          ) : null}

          {participantes.length > 0 ? (
            <>
              <DataTable data={participantes} columns={columns} />
              <p className="text-xs text-text-muted">
                Exibindo {participantes.length}{' '}
                {participantes.length === 1
                  ? 'participante'
                  : 'participantes'}
                {termoBusca.trim() ? ' na busca atual' : ' cadastrados'}.
              </p>
            </>
          ) : termoBusca.trim() !== '' ? (
            <EmptyState
              illustration={<EmptyPesquisar />}
              title="Nenhum resultado encontrado"
              description="Nada encontrado. Verifique se esse participante está cadastrado."
              illustrationClassName="mb-1"
              className="min-h-[60vh]"
            />
          ) : (
            <EmptyState
              illustration={
                <div className="rounded-xl bg-white p-6 shadow-lg">
                  <img
                    src={emptyPacienteSvg}
                    alt=""
                    className="mx-auto max-h-[32rem] w-auto"
                  />
                </div>
              }
              title="Nenhum participante encontrado!"
              description="Cadastre um novo participante para visualizar suas informações."
            >
              <ButtonCadastro
                label="Cadastrar participante"
                onClick={() => setModalCadastroAberto(true)}
              />
            </EmptyState>
          )}
        </div>
      )}

      <ModalCadastroPaciente
        aberto={modalCadastroAberto}
        onFechar={() => setModalCadastroAberto(false)}
        onSubmit={handleSubmitParticipante}
      />

      <ModalConfirmacaoStatusPaciente
        aberto={confirmacaoStatusAberto}
        onFechar={() => setConfirmacaoStatusAberto(false)}
        onSucesso={() => void loadParticipantes()}
        pacienteId={participanteAcaoId}
        novoStatus={novoStatusAcao}
      />

      <ModalEditarPaciente
        aberto={modalEditarAberto}
        onFechar={() => {
          setModalEditarAberto(false)
          setParticipanteEditarId(null)
        }}
        pacienteId={participanteEditarId}
        onSucesso={() => void loadParticipantes()}
      />
    </div>
  )
}
