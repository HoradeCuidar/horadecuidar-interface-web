import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react'
import { BotaoOrientacao as Button } from './BotaoOrientacao'

export function ListaTextosOrdenados({ itens, onChange, rotulo, limite = 50 }: {
  itens: string[]; onChange: (itens: string[], indices?: number[]) => void; rotulo: string; limite?: number
}) {
  function mover(index: number, destino: number) {
    const indices = itens.map((_, i) => i)
    ;[indices[index], indices[destino]] = [indices[destino], indices[index]]
    onChange(indices.map(i => itens[i]), indices)
  }
  return <div className="space-y-3">
    {itens.length === 0 && <p className="rounded-lg border border-dashed border-zinc-200 p-4 text-sm text-text-muted">Não preenchido. Defina o conteúdo com o profissional responsável.</p>}
    {itens.map((texto, index) => <div key={index} className="flex items-start gap-2 rounded-xl border border-zinc-200 bg-white p-3">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-600">{index + 1}</span>
      <textarea aria-label={`${rotulo} ${index + 1}`} value={texto} maxLength={5000} rows={2} onChange={e => onChange(itens.map((t, i) => i === index ? e.target.value : t))} className="min-w-0 flex-1 rounded-lg border border-zinc-200 p-2 text-sm text-text focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500" />
      <div className="flex flex-col gap-1">
        <button type="button" aria-label={`Mover ${rotulo} ${index + 1} para cima`} disabled={index === 0} onClick={() => mover(index, index - 1)} className="rounded p-1 text-brand-600 disabled:opacity-30"><ArrowUp className="size-4" /></button>
        <button type="button" aria-label={`Mover ${rotulo} ${index + 1} para baixo`} disabled={index === itens.length - 1} onClick={() => mover(index, index + 1)} className="rounded p-1 text-brand-600 disabled:opacity-30"><ArrowDown className="size-4" /></button>
        <button type="button" aria-label={`Remover ${rotulo} ${index + 1}`} onClick={() => { const indices = itens.map((_, i) => i).filter(i => i !== index); onChange(indices.map(i => itens[i]), indices) }} className="rounded p-1 text-red-500"><Trash2 className="size-4" /></button>
      </div>
    </div>)}
    <Button type="button" variant="outline" disabled={itens.length >= limite} onClick={() => onChange([...itens, ''])}><Plus className="size-4" />Adicionar {rotulo === 'Passo' ? 'passo' : 'item'}</Button>
  </div>
}
