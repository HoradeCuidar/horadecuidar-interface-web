import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiChevronRight, FiPlus, FiSearch, FiUser } from 'react-icons/fi'
import { pacienteService } from '@/services/paciente'
import { BibliotecaModelosNutricionais } from '@/components/ModelosNutricionais/BibliotecaModelosNutricionais'
import type { ModeloNutricionalResumo } from '@/services/modeloNutricional'
import { prescricaoNutricionalService } from '@/services'
import type { PrescricaoNutricionalResumo } from '@/services/prescricaoNutricional.types'

type Participante = { id: number; nome: string; status?: string }
type Aba = 'biblioteca' | 'preparar'

function dataLegivel(valor: string): string {
  if (!valor) return '—'
  const iso = valor.match(/^(\d{4})-(\d{2})-(\d{2})/)
  return iso ? `${iso[3]}/${iso[2]}/${iso[1]}` : valor
}

function tituloStatus(valor: string): string {
  const texto = valor.trim().toLowerCase()
  return texto ? texto.charAt(0).toUpperCase() + texto.slice(1) : 'Sem status'
}

export function ModelosNutricionais() {
  const navigate = useNavigate()
  const [aba, setAba] = useState<Aba>('biblioteca')
  const [modeloEscolhido, setModeloEscolhido] = useState<ModeloNutricionalResumo | null>(null)
  const [participantes, setParticipantes] = useState<Participante[]>([])
  const [participanteId, setParticipanteId] = useState<number | null>(null)
  const [prescricoes, setPrescricoes] = useState<PrescricaoNutricionalResumo[]>([])
  const [busca, setBusca] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [carregandoPrescricoes, setCarregandoPrescricoes] = useState(false)
  const [erro, setErro] = useState('')

  useEffect(() => {
    if (aba !== 'preparar') return
    let ativo = true
    const timer = window.setTimeout(() => {
      const consulta = busca.trim()
      const pedido = consulta ? pacienteService.buscar(consulta) : pacienteService.listar()
      pedido
        .then((dados) => { if (ativo) setParticipantes(dados) })
        .catch((falha) => { if (ativo) setErro(falha instanceof Error ? falha.message : 'Não foi possível carregar os participantes.') })
        .finally(() => { if (ativo) setCarregando(false) })
    }, busca.trim() ? 250 : 0)
    return () => { ativo = false; window.clearTimeout(timer) }
  }, [aba, busca])

  useEffect(() => {
    if (participanteId === null) {
      return
    }
    let ativo = true
    prescricaoNutricionalService.listarPorPaciente(participanteId)
      .then((dados) => { if (ativo) setPrescricoes(dados) })
      .catch((falha) => { if (ativo) setErro(falha instanceof Error ? falha.message : 'Não foi possível carregar as prescrições.') })
      .finally(() => { if (ativo) setCarregandoPrescricoes(false) })
    return () => { ativo = false }
  }, [participanteId])

  const participantesFiltrados = useMemo(() => {
    const termo = busca.trim().toLocaleLowerCase('pt-BR')
    return participantes.filter((item) => item.nome.toLocaleLowerCase('pt-BR').includes(termo)).slice(0, 20)
  }, [busca, participantes])
  const participante = participantes.find((item) => item.id === participanteId)
  const possuiPrescricaoAtiva = prescricoes.some((item) => item.status.trim().toUpperCase() === 'ATIVA')

  function iniciar(baseId?: number, modeloId?: number) {
    if (participanteId === null) return
    const destino = `/pacientes/${participanteId}/prescricoes-nutricionais/nova`
    navigate(modeloId !== undefined ? `${destino}?modelo=${modeloId}` : baseId === undefined ? destino : `${destino}?base=${baseId}`)
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-10 pt-6 sm:px-6 lg:px-8">
      <nav aria-label="Você está aqui" className="mb-6 flex items-center gap-2 text-xs font-medium text-text-muted">
        <span>Cuidados</span><FiChevronRight aria-hidden /><span className="text-text">Orientações alimentares</span>
      </nav>
      <div className="flex flex-col gap-5 border-b border-surface-100 pb-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-700">Módulo nutricional</p>
          <h1 className="mt-1 font-heading text-2xl font-bold text-text sm:text-3xl">Orientações alimentares</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-text-muted">
            Prepare planos individuais com refeições, opções completas e substituições por alimento.
          </p>
        </div>
        <button type="button" onClick={() => setAba('preparar')}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-700">
          <FiPlus aria-hidden /> Preparar prescrição
        </button>
      </div>

      <div className="mt-5 flex gap-6 border-b border-surface-100" role="tablist" aria-label="Orientações alimentares">
        {([['biblioteca', 'Biblioteca de modelos'], ['preparar', 'Preparar prescrição']] as const).map(([id, rotulo]) => (
          <button key={id} type="button" role="tab" aria-selected={aba === id} onClick={() => setAba(id)}
            className={`border-b-2 pb-3 text-sm font-semibold transition ${aba === id ? 'border-brand-600 text-brand-700' : 'border-transparent text-text-muted hover:text-text'}`}>
            {rotulo}
          </button>
        ))}
      </div>

      {aba === 'biblioteca' ? (
        <BibliotecaModelosNutricionais onPreparar={(modelo) => { setModeloEscolhido(modelo); setAba('preparar') }} />
      ) : (
        <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(18rem,0.8fr)]">
          <section className="rounded-2xl border border-surface-100 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="font-heading text-lg font-bold text-text">Preparar plano alimentar</h2>
            <p className="mt-1 text-sm text-text-muted">Selecione um participante e comece em branco, use um modelo da biblioteca ou copie uma prescrição anterior dele.</p>
            <label htmlFor="buscar-participante-modelo" className="mt-6 block text-sm font-semibold text-text">Participante</label>
            <div className="relative mt-2">
              <FiSearch className="absolute left-3 top-3.5 size-4 text-text-muted" aria-hidden />
              <input id="buscar-participante-modelo" value={busca} onChange={(e) => { setCarregando(true); setErro(''); setBusca(e.target.value) }} placeholder="Buscar participante pelo nome"
                className="w-full rounded-xl border border-surface-100 bg-white py-3 pl-10 pr-3 text-sm text-text outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100" />
            </div>
            {erro ? <p role="alert" className="mt-3 text-sm text-error-500">{erro}</p> : null}
            {carregando ? <p className="mt-3 text-sm text-text-muted">Carregando participantes...</p> : (
              <div className="mt-3 max-h-52 space-y-1 overflow-y-auto rounded-xl border border-surface-100 p-1">
                {participantesFiltrados.length === 0 ? <p className="p-3 text-sm text-text-muted">Nenhum participante encontrado.</p> : participantesFiltrados.map((item) => (
                  <button key={item.id} type="button" onClick={() => { setCarregandoPrescricoes(true); setErro(''); setParticipanteId(item.id); setPrescricoes([]) }}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition ${item.id === participanteId ? 'bg-brand-100 font-semibold text-brand-700' : 'text-text hover:bg-surface-0'}`}>
                    <FiUser aria-hidden /> {item.nome}
                  </button>
                ))}
              </div>
            )}
            {participante ? <div className="mt-6 border-t border-surface-100 pt-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div><h3 className="font-heading text-base font-bold text-text">Prescrições anteriores</h3><p className="text-xs text-text-muted">A cópia será independente da prescrição original.</p></div>
                <button type="button" disabled={carregandoPrescricoes || possuiPrescricaoAtiva} onClick={() => iniciar()} className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"><FiPlus aria-hidden /> Começar em branco</button>
              </div>
              {possuiPrescricaoAtiva ? <p role="alert" className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">Este participante já possui uma prescrição nutricional ativa. Inative-a no perfil antes de emitir outra.</p> : null}
              {modeloEscolhido ? <button type="button" disabled={carregandoPrescricoes || possuiPrescricaoAtiva} onClick={() => iniciar(undefined, modeloEscolhido.id)} className="mt-4 rounded-xl border border-brand-200 bg-brand-50 px-4 py-2.5 text-sm font-semibold text-brand-700 hover:bg-brand-100 disabled:cursor-not-allowed disabled:opacity-50">Usar modelo: {modeloEscolhido.nome}</button> : null}
              {carregandoPrescricoes ? <p className="mt-4 text-sm text-text-muted">Carregando prescrições...</p> : prescricoes.length === 0 ? <p className="mt-4 text-sm text-text-muted">Este participante ainda não possui prescrições para usar como base.</p> : (
                <div className="mt-4 space-y-2">{prescricoes.map((item) => (
                  <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-surface-100 bg-surface-0/50 p-3">
                    <div><p className="text-sm font-semibold text-text">Prescrição #{item.id}</p><p className="text-xs text-text-muted">{dataLegivel(item.dataInicio)} a {dataLegivel(item.dataFim)} · {tituloStatus(item.status)}</p></div>
                    <button type="button" disabled={possuiPrescricaoAtiva} onClick={() => iniciar(item.id)} className="rounded-lg border border-brand-200 bg-white px-3 py-2 text-xs font-semibold text-brand-700 hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-50">Usar como base</button>
                  </div>
                ))}</div>
              )}
            </div> : null}
          </section>
          <aside className="h-fit rounded-2xl border border-surface-100 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="font-heading text-lg font-bold text-text">Resumo da preparação</h2>
            <p className="mt-2 text-sm text-text-muted">Os dados individuais e as datas serão definidos no formulário de prescrição.</p>
            <dl className="mt-5 space-y-4 border-t border-surface-100 pt-5 text-sm">
              <div><dt className="text-xs font-semibold text-text-muted">Participante</dt><dd className="mt-1 font-semibold text-text">{participante?.nome ?? 'Não selecionado'}</dd></div>
              <div><dt className="text-xs font-semibold text-text-muted">Modelo selecionado</dt><dd className="mt-1 text-text">{modeloEscolhido?.nome ?? 'Nenhum; escolha na biblioteca se desejar'}</dd></div>
              <div><dt className="text-xs font-semibold text-text-muted">Prescrições que podem servir de base</dt><dd className="mt-1 font-semibold text-text">{participante ? prescricoes.length : '—'}</dd></div>
            </dl>
          </aside>
        </div>
      )}
    </div>
  )
}
