import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ButtonCadastro, Skeleton } from '@/components'
import { BotaoOrientacao as Button } from '@/components/OrientacoesFuncionais/BotaoOrientacao'
import { CardExercicio, ModalConfirmacaoStatusExercicio } from '@/components/OrientacoesFuncionais'
import { orientacaoFuncionalService, tagFuncionalService, authService } from '@/services'
import type { CategoriaOrientacao, TagFuncional, OrientacaoFuncionalResponse, SpringPage } from '@/services/orientacaoFuncional.types'

export function Atividades() {
  const navigate = useNavigate()
  const [page, setPage] = useState(0)
  const [categoriaId, setCategoriaId] = useState<number | undefined>()
  const [tagId, setTagId] = useState<number | undefined>()
  const [categorias, setCategorias] = useState<CategoriaOrientacao[]>([])
  const [tags, setTags] = useState<TagFuncional[]>([])
  const [data, setData] = useState<SpringPage<OrientacaoFuncionalResponse> | null>(null)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [erroFiltros, setErroFiltros] = useState<string | null>(null)
  const [reload, setReload] = useState(0)
  const [exercicioStatus, setExercicioStatus] = useState<OrientacaoFuncionalResponse | null>(null)
  const profissional = ['ADMIN', 'PROFISSIONAL_DA_SAUDE'].includes(authService.getUser()?.role ?? '')
  useEffect(() => {
    let ativo = true
    Promise.all([orientacaoFuncionalService.categorias(), tagFuncionalService.listar()])
      .then(([c, t]) => { if (ativo) { setCategorias(c); setTags(t) } })
      .catch(error => { if (ativo) setErroFiltros(error instanceof Error ? error.message : 'Erro ao carregar filtros.') })
    return () => { ativo = false }
  }, [])
  useEffect(() => {
    let ativo = true
    orientacaoFuncionalService.listar(page, 12, { categoriaId, tagId })
      .then(dados => { if (ativo) setData(dados) })
      .catch(error => { if (ativo) setErro(error instanceof Error ? error.message : 'Erro ao carregar orientações.') })
      .finally(() => { if (ativo) setLoading(false) })
    return () => { ativo = false }
  }, [page, categoriaId, tagId, reload])
  return <div className="space-y-6 p-4 sm:p-6 lg:p-8">
    <header className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="font-heading text-2xl font-bold text-text">Orientações funcionais</h1><p className="mt-1 text-sm text-text-muted">{profissional ? 'Catálogo de conteúdos, revisão e publicação.' : 'Consulte as instruções e os cuidados de cada orientação.'}</p></div>{profissional && <ButtonCadastro label="Nova orientação" onClick={() => navigate('/atividades/nova')} />}</header>
    <div className="flex flex-wrap gap-4 rounded-xl border border-zinc-100 bg-white p-4">
      <label className="text-sm font-medium text-text">Categoria<select value={categoriaId ?? ''} onChange={e => { setLoading(true); setErro(null); setCategoriaId(e.target.value ? Number(e.target.value) : undefined); setPage(0) }} className="ml-2 rounded-lg border border-zinc-200 p-2"><option value="">Todas</option>{categorias.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}</select></label>
      <label className="text-sm font-medium text-text">Tag<select value={tagId ?? ''} onChange={e => { setLoading(true); setErro(null); setTagId(e.target.value ? Number(e.target.value) : undefined); setPage(0) }} className="ml-2 rounded-lg border border-zinc-200 p-2"><option value="">Todas</option>{tags.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}</select></label>
      {erroFiltros && <p role="alert" className="text-sm text-red-600">{erroFiltros}</p>}
    </div>
    {loading ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[0, 1, 2].map(i => <Skeleton key={i} className="h-72 rounded-xl" />)}</div> : erro ? <div role="alert"><p className="text-red-600">{erro}</p><Button variant="outline" onClick={() => { setLoading(true); setErro(null); setReload(r => r + 1) }}>Tentar novamente</Button></div> : <>
      {data?.content.length === 0 ? <p className="rounded-xl bg-white p-10 text-center text-text-muted">Nenhuma orientação encontrada para os filtros selecionados.</p> : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{data?.content.map(item => <CardExercicio key={item.id} item={item} onAlterarStatus={setExercicioStatus} />)}</div>}
      {data && data.totalPages > 1 && <div className="flex items-center justify-center gap-4"><Button variant="outline" disabled={data.first} onClick={() => { setLoading(true); setPage(p => Math.max(0, p - 1)) }}>Anterior</Button><p className="text-sm text-text-muted">Página {data.number + 1} de {data.totalPages}</p><Button variant="outline" disabled={data.last} onClick={() => { setLoading(true); setPage(p => p + 1) }}>Próxima</Button></div>}
    </>}
    <ModalConfirmacaoStatusExercicio aberto={exercicioStatus != null} onFechar={() => setExercicioStatus(null)} onSucesso={() => { setLoading(true); setErro(null); setReload(r => r + 1) }} exercicioId={exercicioStatus?.id ?? null} nomeExercicio={exercicioStatus?.nome ?? ''} ativar={false} />
  </div>
}
