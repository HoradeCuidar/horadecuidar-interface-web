import { GRUPOS_CUIDADO } from './orientacaoFuncional.constants'
import { ListOrdered } from 'lucide-react'
import type { OrientacaoFuncionalResponse } from '@/services/orientacaoFuncional.types'


type Conteudo = Pick<OrientacaoFuncionalResponse, 'nome' | 'resumo' | 'finalidade' | 'categoria' | 'tags' | 'materiais' | 'duracaoEstimada' | 'passos' | 'cuidados' | 'midias'>

export function ConteudoOrientacao({ dados }: { dados: Conteudo }) {
  const capa = dados.midias.find(m => m.capa)
  return <div className="space-y-4">
    {capa && <figure><img src={capa.url} alt={capa.textoAlternativo || ''} className="max-h-80 w-full rounded-2xl object-contain" />{capa.legenda && <figcaption className="mt-1 text-sm text-text-muted">{capa.legenda}</figcaption>}</figure>}
    <section className="rounded-xl border border-brand-100 p-5">
      <h2 className="font-heading text-xl font-bold text-text">{dados.nome || 'Orientação sem título'}</h2>
      {dados.categoria && <p className="mt-2 inline-block rounded-full bg-amber-100 px-3 py-1 text-xs text-amber-800">{dados.categoria.nome}</p>}
      <p className="mt-3 whitespace-pre-wrap text-sm text-text-muted">{dados.resumo || 'Resumo não preenchido.'}</p>
      {dados.finalidade && <div className="mt-4"><h3 className="font-semibold text-text">Finalidade</h3><p className="whitespace-pre-wrap text-sm text-text-muted">{dados.finalidade}</p></div>}
      <div className="mt-3 flex flex-wrap gap-2">{dados.tags.map(t => <span key={t.id} className="rounded-full bg-brand-100 px-3 py-1 text-xs text-brand-600">{t.nome}</span>)}</div>
      {dados.duracaoEstimada != null && <p className="mt-4 text-sm text-text"><strong>Duração estimada:</strong> {dados.duracaoEstimada} minutos</p>}
      {dados.materiais && <p className="mt-2 whitespace-pre-wrap text-sm text-text"><strong>Materiais:</strong> {dados.materiais}</p>}
    </section>
    <section className="rounded-xl border border-blue-100 bg-blue-50/40 p-5">
      <h3 className="mb-3 flex items-center gap-2 font-semibold text-text"><ListOrdered className="size-5" />Execução da atividade</h3>
      {dados.passos.length === 0 && <p className="text-sm text-text-muted">Instruções não preenchidas.</p>}
      <ol className="space-y-4">{dados.passos.map((p, index) => <li key={p.id ?? index}>
        <p className="flex gap-3 text-sm text-text"><span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-100 font-semibold text-brand-600">{index + 1}</span><span className="whitespace-pre-wrap">{p.instrucao || 'Passo não preenchido.'}</span></p>
        {dados.midias.filter(m => m.passoId != null && m.passoId === p.id).map(m => <figure key={m.id} className="mt-3"><img src={m.url} alt={m.textoAlternativo || ''} className="max-h-60 rounded-xl object-contain" />{m.legenda && <figcaption className="mt-1 text-xs text-text-muted">{m.legenda}</figcaption>}</figure>)}
      </li>)}</ol>
    </section>
    {GRUPOS_CUIDADO.map(({ tipo, titulo, cor, Icone }) => <section key={tipo} className={`rounded-xl border p-5 ${cor}`}>
      <h3 className="mb-2 flex items-center gap-2 font-semibold"><Icone className="size-5" />{titulo}</h3>
      {dados.cuidados.some(c => c.tipo === tipo && c.texto.trim()) ? <ul className="list-inside list-disc space-y-2 text-sm">{dados.cuidados.filter(c => c.tipo === tipo).map((c, i) => <li key={i} className="whitespace-pre-wrap">{c.texto}</li>)}</ul> : <p className="text-sm">Não preenchido ou não revisado.</p>}
    </section>)}
    {dados.midias.filter(m => !m.capa && m.passoId == null).map(m => <figure key={m.id}><img src={m.url} alt={m.textoAlternativo || ''} className="max-h-60 rounded-xl object-contain" />{m.legenda && <figcaption className="text-sm text-text-muted">{m.legenda}</figcaption>}</figure>)}
  </div>
}
