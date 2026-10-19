import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { toast } from 'sonner'
import { Input } from '@/components'
import { BotaoOrientacao as Button } from './BotaoOrientacao'
import { SeletorTags } from './SeletorTags'
import { ConteudoOrientacao } from './ConteudoOrientacao'
import { GRUPOS_CUIDADO } from './orientacaoFuncional.constants'
import { ListaTextosOrdenados } from './ListaTextosOrdenados'
import { EditorMidias, type MidiaEdicao, type PassoEdicao } from './EditorMidias'
import { orientacaoFuncionalService, tagFuncionalService, authService } from '@/services'
import type { CategoriaOrientacao, CuidadoOrientacao, OrientacaoFuncionalResponse, TagFuncional, HistoricoOrientacao } from '@/services/orientacaoFuncional.types'
import equilibrio from '@/assets/illustrations-balancing.png'

export type ValoresFormExercicio = OrientacaoFuncionalResponse
const ETAPAS = ['Informações', 'Execução', 'Cuidados', 'Revisão']

export function FormularioExercicio({ titulo, valoresIniciais, onCancelar }: {
  titulo: string; valoresIniciais?: OrientacaoFuncionalResponse; onCancelar: () => void
}) {
  const [etapa, setEtapa] = useState(0)
  const [nome, setNome] = useState(valoresIniciais?.nome ?? '')
  const [resumo, setResumo] = useState(valoresIniciais?.resumo ?? '')
  const [finalidade, setFinalidade] = useState(valoresIniciais?.finalidade ?? '')
  const [categoriaId, setCategoriaId] = useState(valoresIniciais?.categoria?.id ?? null)
  const [duracao, setDuracao] = useState(valoresIniciais?.duracaoEstimada?.toString() ?? '')
  const [materiais, setMateriais] = useState(valoresIniciais?.materiais ?? '')
  const [tagsIds, setTagsIds] = useState(valoresIniciais?.tags.map(t => t.id) ?? [])
  const [passos, setPassos] = useState<PassoEdicao[]>(() => (valoresIniciais?.passos ?? []).map(p => ({ ...p, chave: String(p.id) })))
  const [cuidados, setCuidados] = useState<CuidadoOrientacao[]>(valoresIniciais?.cuidados ?? [])
  const [midias, setMidias] = useState<MidiaEdicao[]>(() => (valoresIniciais?.midias ?? []).map(m => ({ ...m, chave: String(m.id), legenda: m.legenda ?? '', textoAlternativo: m.textoAlternativo ?? '', passoChave: m.passoId == null ? null : String(m.passoId) })))
  const [revisado, setRevisado] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [categorias, setCategorias] = useState<CategoriaOrientacao[]>([])
  const [tags, setTags] = useState<TagFuncional[]>([])
  const [carregandoOpcoes, setCarregandoOpcoes] = useState(true)
  const [erroOpcoes, setErroOpcoes] = useState<string | null>(null)
  const [historico, setHistorico] = useState<HistoricoOrientacao[]>([])
  const [status, setStatus] = useState(valoresIniciais?.status ?? 'RASCUNHO')
  const salvo = useRef(valoresIniciais)
  const urlsLocais = useRef<string[]>([])

  useEffect(() => {
    let ativo = true
    Promise.all([orientacaoFuncionalService.categorias(), tagFuncionalService.listar()])
      .then(([c, t]) => { if (ativo) { setCategorias(c); setTags(t) } })
      .catch(error => { if (ativo) setErroOpcoes(error instanceof Error ? error.message : 'Erro ao carregar opções.') })
      .finally(() => { if (ativo) setCarregandoOpcoes(false) })
    return () => { ativo = false }
  }, [])
  useEffect(() => () => urlsLocais.current.forEach(url => URL.revokeObjectURL(url)), [])

  const pendencias = [
    !nome.trim() || nome === 'Orientação sem título' ? 'Informe o nome.' : '',
    !resumo.trim() ? 'Preencha o resumo.' : '',
    !categoriaId || !categorias.some(c => c.id === categoriaId) ? 'Selecione uma categoria ativa.' : '',
    tagsIds.some(id => !tags.some(t => t.id === id)) ? 'Remova as tags inativas antes de publicar.' : '',
    passos.length === 0 || passos.some(p => !p.instrucao.trim()) ? 'Preencha as instruções de todos os passos.' : '',
    ...GRUPOS_CUIDADO.map(g => !cuidados.some(c => c.tipo === g.tipo) || cuidados.some(c => c.tipo === g.tipo && !c.texto.trim()) ? `Revise e preencha: ${g.titulo}.` : ''),
    !midias.some(m => m.capa) ? 'Selecione uma imagem de capa.' : '',
  ].filter(Boolean)

  async function salvar(publicar: boolean) {
    if (publicar && (pendencias.length > 0 || !revisado)) return
    if (duracao && (!Number.isInteger(Number(duracao)) || Number(duracao) < 1 || Number(duracao) > 1440)) { setErro('Duração deve ser de 1 a 1440 minutos.'); return }
    setSalvando(true); setErro(null)
    try {
      const dados = { nome: nome.trim(), resumo: resumo.trim() || null, descricao: resumo.trim() || null,
        finalidade: finalidade.trim() || null, categoriaId, duracaoEstimada: duracao ? Number(duracao) : null,
        materiais: materiais.trim() || null, tagsIds, passos: passos.map(({ id, instrucao }) => ({ id, instrucao })), cuidados }
      let resultado = salvo.current
        ? await orientacaoFuncionalService.atualizar(salvo.current.id, dados)
        : await orientacaoFuncionalService.criar(dados)
      salvo.current = resultado
      const passosSalvos = passos.map((p, i) => ({ ...p, id: resultado.passos[i].id }))
      setPassos(passosSalvos)
      setStatus('RASCUNHO')
      // Mantém o ID e cada upload concluído para permitir nova tentativa sem duplicar cadastros.
      for (const m of resultado.midias) {
        if (!midias.some(local => local.id === m.id)) {
          resultado = await orientacaoFuncionalService.removerMidia(resultado.id, m.id)
          salvo.current = resultado
        }
      }
      const novasMidias = [...midias]
      for (let i = 0; i < novasMidias.length; i++) {
        const m = novasMidias[i]
        const metadata = { passoId: passosSalvos.find(p => p.chave === m.passoChave)?.id ?? null, ordem: i, legenda: m.legenda || null, textoAlternativo: m.textoAlternativo || null, capa: m.capa }
        if (m.arquivo) {
          const idsAnteriores = new Set(resultado.midias.map(item => item.id))
          resultado = await orientacaoFuncionalService.adicionarMidia(resultado.id, m.arquivo, metadata)
          const enviada = resultado.midias.find(item => !idsAnteriores.has(item.id))!
          novasMidias[i] = { ...m, id: enviada.id, arquivo: undefined, url: enviada.url }
          setMidias([...novasMidias])
        } else if (m.id != null) {
          resultado = await orientacaoFuncionalService.atualizarMidia(resultado.id, m.id, metadata)
        }
        salvo.current = resultado
      }
      if (publicar) {
        resultado = await orientacaoFuncionalService.publicar(resultado.id)
        salvo.current = resultado; setStatus('PUBLICADA'); toast.success('Orientação publicada com sucesso.'); onCancelar()
      } else { setRevisado(false); toast.success('Rascunho salvo. Você pode continuar a edição.') }
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Não foi possível salvar a orientação.')
    } finally { setSalvando(false) }
  }

  async function carregarHistorico() {
    if (!salvo.current) return
    try { setHistorico(await orientacaoFuncionalService.historico(salvo.current.id)) }
    catch (error) { toast.error(error instanceof Error ? error.message : 'Erro ao carregar histórico.') }
  }

  if (!['ADMIN', 'PROFISSIONAL_DA_SAUDE'].includes(authService.getUser()?.role ?? '')) return <p className="text-red-600">Apenas profissionais autorizados podem editar orientações.</p>

  const previa = {
    nome, resumo, finalidade, categoria: categorias.find(c => c.id === categoriaId) ?? (valoresIniciais?.categoria?.id === categoriaId ? valoresIniciais.categoria : null),
    tags: tags.filter(t => tagsIds.includes(t.id)), materiais, duracaoEstimada: duracao ? Number(duracao) : null,
    passos: passos.map((p, i) => ({ ...p, id: p.id ?? -(i + 1) })), cuidados,
    midias: midias.map((m, i) => { const index = passos.findIndex(p => p.chave === m.passoChave); return {
      id: m.id ?? -(i + 1), url: m.url, legenda: m.legenda, textoAlternativo: m.textoAlternativo, capa: m.capa, ordem: i,
      passoId: index < 0 ? null : passos[index].id ?? -(index + 1),
    } }),
  }

  return <div className="space-y-6 lg:flex lg:min-h-0 lg:flex-1 lg:flex-col lg:gap-6 lg:space-y-0">
    <nav aria-label="Etapas da orientação" className="mx-auto flex max-w-4xl shrink-0 items-center gap-2 py-2 sm:gap-4">
      {ETAPAS.map((label, i) => <div key={label} className="flex flex-1 items-center gap-2 sm:gap-3">
        <button type="button" disabled={salvando} aria-label={`${i + 1}. ${label}`} aria-current={etapa === i ? 'step' : undefined} onClick={() => { setEtapa(i); setRevisado(false) }} className={`flex items-center gap-2 text-xs sm:text-sm ${i === etapa ? 'font-semibold text-text' : 'text-text-muted'}`}>
          <span className={`flex size-8 shrink-0 items-center justify-center rounded-full ${i <= etapa ? 'bg-brand-600 text-white' : 'bg-zinc-200 text-zinc-500'}`}>{i < etapa ? <Check className="size-4" /> : i + 1}</span><span className="hidden sm:inline">{label}</span>
        </button>{i < 3 && <span className={`h-px flex-1 ${i < etapa ? 'bg-brand-500' : 'bg-zinc-300'}`} />}
      </div>)}
    </nav>
    <div className="grid gap-4 lg:min-h-0 lg:flex-1 xl:grid-cols-[0.7fr_1fr]">
      <aside className="hidden rounded-2xl border border-brand-100 bg-brand-50/40 p-6 xl:block xl:h-full xl:min-h-0 xl:overflow-y-auto">
        <img src={equilibrio} alt="" className="mx-auto max-h-[34rem] w-full object-contain" />
        <h2 className="mt-4 font-heading text-2xl font-bold text-text">{etapa === 0 ? 'Orientações claras para cada participante' : etapa === 3 ? 'Revise antes de publicar' : nome || 'Orientação funcional'}</h2>
        <div className="my-4 h-1 w-12 rounded bg-brand-600" />
        <p className="text-sm leading-relaxed text-text-muted">{etapa === 0 ? 'Organize instruções, imagens e cuidados para apresentar o conteúdo de forma clara.' : resumo || 'Complete as informações e confira como serão apresentadas ao participante.'}</p>
        <p className="mt-4 text-xs font-medium text-brand-600">{status === 'PUBLICADA' ? 'Publicada — alterações exigem nova revisão' : status === 'INATIVA' ? 'Inativa' : 'Rascunho · revisão pendente'}</p>
      </aside>
      <form onSubmit={e => e.preventDefault()} className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm sm:p-8 lg:flex lg:h-full lg:min-h-0 lg:flex-col lg:overflow-y-auto">
        <fieldset disabled={salvando} className="min-w-0 space-y-6 lg:flex lg:flex-1 lg:shrink-0 lg:flex-col lg:gap-6 lg:space-y-0" onChange={() => setRevisado(false)}>
          <header><h1 className="font-heading text-2xl font-bold text-text">{[titulo, 'Como realizar', 'Cuidados e segurança', 'Revisar orientação'][etapa]}</h1><p className="mt-1 text-sm text-text-muted">{['Informações básicas', 'Organize as instruções em etapas.', 'Informe os cuidados antes e durante a atividade.', 'Confira o conteúdo como será apresentado ao participante.'][etapa]}</p></header>
          {etapa === 0 && <div className="space-y-5">
            <Input label="Nome" size="compact" value={nome} maxLength={100} onChange={e => setNome(e.target.value)} />
            <CampoTexto label="Resumo" value={resumo} onChange={setResumo} maxLength={2000} />
            <CampoTexto label="Finalidade" value={finalidade} onChange={setFinalidade} />
            <label className="block text-sm font-medium text-text">Categoria<select value={categoriaId ?? ''} onChange={e => setCategoriaId(e.target.value ? Number(e.target.value) : null)} className="mt-2 w-full rounded-xl border border-zinc-300 bg-white p-3 text-sm"><option value="">Selecione uma categoria</option>{categoriaId && !categorias.some(c => c.id === categoriaId) && <option value={categoriaId} disabled>Categoria inativa — selecione outra</option>}{categorias.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}</select></label>
            <SeletorTags tags={tags} selecionadas={tagsIds} onChange={setTagsIds} loading={carregandoOpcoes} erro={erroOpcoes} />
            {!carregandoOpcoes && (valoresIniciais?.tags ?? []).filter(t => tagsIds.includes(t.id) && !tags.some(disponivel => disponivel.id === t.id)).map(t => <Button key={t.id} type="button" variant="outline" onClick={() => setTagsIds(tagsIds.filter(id => id !== t.id))}>Remover tag inativa: {t.nome}</Button>)}
            <p className="text-xs text-text-muted">Categorias e tags organizam o catálogo; não indicam adequação individual.</p>
          </div>}
          {etapa === 1 && <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2"><Input label="Duração estimada (minutos, opcional)" size="compact" type="number" min={1} max={1440} value={duracao} onChange={e => setDuracao(e.target.value)} /><Input label="Materiais necessários (opcional)" size="compact" maxLength={5000} value={materiais} onChange={e => setMateriais(e.target.value)} /></div>
            <div><h2 className="mb-3 font-heading text-lg font-semibold text-text">Passos da atividade</h2><ListaTextosOrdenados rotulo="Passo" itens={passos.map(p => p.instrucao)} onChange={(textos, indices) => {
              const proximos = textos.map((instrucao, i) => { const anterior = passos[indices?.[i] ?? i]; return anterior ? { ...anterior, instrucao } : { chave: crypto.randomUUID(), id: null, instrucao } })
              setPassos(proximos); setMidias(midias.map(m => ({ ...m, passoChave: proximos.some(p => p.chave === m.passoChave) ? m.passoChave : null })))
            }} /></div>
            <EditorMidias midias={midias} passos={passos} onChange={setMidias} onObjectUrl={url => urlsLocais.current.push(url)} />
          </div>}
          {etapa === 2 && <div className="space-y-4">{GRUPOS_CUIDADO.map(({ tipo, titulo: tituloGrupo, descricao, cor, Icone }) => <section key={tipo} className={`rounded-xl border border-l-4 p-4 ${cor}`}>
            <h2 className="flex items-center gap-3 font-heading text-lg font-semibold"><Icone className="size-6" />{tituloGrupo}</h2><p className="mb-4 mt-1 text-sm text-text-muted">{descricao}</p>
            <ListaTextosOrdenados rotulo="Item" limite={30} itens={cuidados.filter(c => c.tipo === tipo).map(c => c.texto)} onChange={textos => setCuidados([...cuidados.filter(c => c.tipo !== tipo), ...textos.map(texto => ({ tipo, texto }))])} />
          </section>)}<p className="rounded-lg bg-brand-50 p-3 text-xs text-text-muted">Este conteúdo será revisado antes da publicação. Campos vazios permanecem como não preenchidos.</p></div>}
          {etapa === 3 && <div className="space-y-5">
            <ConteudoOrientacao dados={previa} />
            {pendencias.length > 0 && <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900"><p className="font-semibold">Pendências para publicação</p><ul className="mt-2 list-inside list-disc">{pendencias.map(p => <li key={p}>{p}</li>)}</ul></div>}
            <label className="flex items-start gap-3 rounded-xl border border-brand-200 p-4" onChange={e => e.stopPropagation()}><input type="checkbox" checked={revisado} onChange={e => setRevisado(e.target.checked)} className="mt-1 size-5" /><span><strong className="block text-sm text-text">Conteúdo revisado por profissional</strong><span className="text-xs text-text-muted">Confirmo que revisei todas as informações e os três grupos de cuidados. Meu usuário será registrado como responsável pela revisão.</span></span></label>
          </div>}
          {erro && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{erro}</p>}
          <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100 pt-5 lg:mt-auto">
            <Button type="button" variant="outline" onClick={() => etapa === 0 ? onCancelar() : setEtapa(etapa - 1)}><ArrowLeft className="size-4" />Voltar</Button>
            <div className="flex flex-wrap gap-3"><Button type="button" variant="outline" onClick={() => void salvar(false)}>{salvando ? 'Salvando...' : 'Salvar rascunho'}</Button>
              {etapa < 3 ? <Button type="button" onClick={() => { setEtapa(etapa + 1); setRevisado(false) }}>Próxima etapa<ArrowRight className="size-4" /></Button> : <Button type="button" disabled={!revisado || pendencias.length > 0} onClick={() => void salvar(true)}>Publicar orientação</Button>}
            </div>
          </footer>
        </fieldset>
        {salvo.current && <details className="mt-5 border-t border-zinc-100 pt-3" onToggle={e => { if (e.currentTarget.open) void carregarHistorico() }}><summary className="cursor-pointer text-sm font-medium text-brand-600">Histórico de alterações</summary>
          {historico.length === 0 ? <p className="mt-2 text-sm text-text-muted">Nenhuma alteração registrada.</p> : historico.map(h => <details key={h.id} className="mt-3 rounded-lg border border-zinc-200 p-3"><summary className="text-xs text-text-muted">{new Date(h.dataAlteracao).toLocaleString('pt-BR')} · {h.acao.replaceAll('_', ' ')} · usuário {h.autorId}</summary><div className="mt-4"><ConteudoHistorico conteudo={h.conteudoAnterior} /></div></details>)}
        </details>}
      </form>
    </div>
  </div>
}

function CampoTexto({ label, value, onChange, maxLength = 5000 }: { label: string; value: string; onChange: (s: string) => void; maxLength?: number }) {
  return <label className="block text-sm font-medium text-text">{label}<textarea value={value} onChange={e => onChange(e.target.value)} rows={3} maxLength={maxLength} className="mt-2 block w-full rounded-xl border border-zinc-300 p-3 text-sm font-normal focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500" /></label>
}

function ConteudoHistorico({ conteudo }: { conteudo: string }) {
  let dados: OrientacaoFuncionalResponse | null = null
  try { dados = JSON.parse(conteudo) as OrientacaoFuncionalResponse } catch { /* Registro legado ilegível. */ }
  return dados ? <ConteudoOrientacao dados={dados} /> : <p className="text-sm text-text-muted">Não foi possível apresentar este conteúdo anterior.</p>
}
