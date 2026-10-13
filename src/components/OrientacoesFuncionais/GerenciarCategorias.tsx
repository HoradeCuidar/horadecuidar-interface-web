import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Input } from '@/components'
import { BotaoOrientacao as Button } from './BotaoOrientacao'
import { orientacaoFuncionalService } from '@/services'
import type { CategoriaOrientacao } from '@/services/orientacaoFuncional.types'

export function GerenciarCategorias() {
  const [categorias, setCategorias] = useState<CategoriaOrientacao[]>([])
  const [nome, setNome] = useState('')
  const [editando, setEditando] = useState<number | undefined>()
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [inativarId, setInativarId] = useState<number | null>(null)
  async function carregar() {
    try { setCategorias(await orientacaoFuncionalService.categorias()); setErro(null) }
    catch (error) { setErro(error instanceof Error ? error.message : 'Erro ao carregar categorias.') }
  }
  useEffect(() => { void carregar() }, [])
  async function salvar(e: React.FormEvent) {
    e.preventDefault(); setSalvando(true)
    try { await orientacaoFuncionalService.salvarCategoria(nome.trim(), editando); setNome(''); setEditando(undefined); await carregar(); toast.success('Categoria salva.') }
    catch (error) { toast.error(error instanceof Error ? error.message : 'Erro ao salvar categoria.') }
    finally { setSalvando(false) }
  }
  async function inativar() {
    if (inativarId == null) return
    setSalvando(true)
    try { await orientacaoFuncionalService.inativarCategoria(inativarId); setInativarId(null); await carregar() }
    catch (error) { toast.error(error instanceof Error ? error.message : 'Erro ao inativar categoria.') }
    finally { setSalvando(false) }
  }
  return <section className="space-y-4 rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm">
    <h2 className="font-heading text-xl font-bold text-text">Categorias</h2>
    <p className="text-sm text-text-muted">Defina o assunto principal das orientações. A inativação preserva os conteúdos vinculados.</p>
    {erro && <p role="alert" className="text-sm text-red-600">{erro}</p>}
    <div className="flex flex-wrap gap-3">{categorias.map(c => <div key={c.id} className="flex items-center gap-2 rounded-lg border border-zinc-200 p-2"><span className="text-sm text-text">{c.nome}</span><Button variant="ghost" size="sm" disabled={salvando} onClick={() => { setNome(c.nome); setEditando(c.id) }}>Editar</Button><Button variant="ghost" size="sm" disabled={salvando} onClick={() => setInativarId(c.id)}>Inativar</Button></div>)}</div>
    {inativarId != null && <div className="rounded-lg bg-amber-50 p-3 text-sm"><p>Inativar esta categoria? Ela deixará de ser oferecida em novos cadastros.</p><div className="mt-2 flex gap-2"><Button variant="outline" disabled={salvando} onClick={() => setInativarId(null)}>Cancelar</Button><Button disabled={salvando} onClick={() => void inativar()}>Confirmar inativação</Button></div></div>}
    <form onSubmit={salvar} className="flex flex-wrap items-end gap-3"><div className="min-w-48 flex-1"><Input label={editando ? 'Editar categoria' : 'Nova categoria'} size="compact" required maxLength={100} value={nome} onChange={e => setNome(e.target.value)} /></div><Button type="submit" disabled={salvando || !nome.trim()}>Salvar categoria</Button>{editando && <Button type="button" variant="outline" onClick={() => { setEditando(undefined); setNome('') }}>Cancelar edição</Button>}</form>
  </section>
}
