import { ArrowDown, ArrowUp, Trash2, Upload } from 'lucide-react'
import { Input } from '@/components'
import { toast } from 'sonner'

export type MidiaEdicao = {
  chave: string; id?: number; arquivo?: File; url: string; legenda: string
  textoAlternativo: string; capa: boolean; passoChave: string | null
}
export type PassoEdicao = { chave: string; id: number | null; instrucao: string }

export function EditorMidias({ midias, passos, onChange, onObjectUrl }: {
  midias: MidiaEdicao[]; passos: PassoEdicao[]; onChange: (m: MidiaEdicao[]) => void; onObjectUrl: (url: string) => void
}) {
  function alterar(index: number, dados: Partial<MidiaEdicao>) {
    onChange(midias.map((m, i) => i === index ? { ...m, ...dados } : dados.capa ? { ...m, capa: false } : m))
  }
  function adicionar(files: FileList | null) {
    if (!files) return
    if (files.length + midias.length > 10) { toast.error('São permitidas até 10 imagens.'); return }
    const novos: MidiaEdicao[] = []
    for (const arquivo of Array.from(files)) {
      if (!['image/png', 'image/jpeg'].includes(arquivo.type) || arquivo.size > 5 * 1024 * 1024) {
        toast.error('Envie imagens PNG ou JPEG de até 5 MB.'); return
      }
    }
    for (const arquivo of Array.from(files)) {
      const url = URL.createObjectURL(arquivo); onObjectUrl(url)
      novos.push({ chave: crypto.randomUUID(), arquivo, url, legenda: '', textoAlternativo: '', capa: midias.length === 0 && novos.length === 0, passoChave: null })
    }
    onChange([...midias, ...novos])
  }
  function mover(index: number, destino: number) {
    const proxima = [...midias]
    ;[proxima[index], proxima[destino]] = [proxima[destino], proxima[index]]
    onChange(proxima)
  }
  return <section className="space-y-4 border-t border-zinc-100 pt-5">
    <div><h2 className="font-heading text-lg font-semibold text-text">Imagens</h2><p className="text-sm text-text-muted">Até 10 imagens PNG ou JPEG de 5 MB. Selecione uma capa para publicar.</p></div>
    {midias.map((m, i) => <div key={m.chave} className="space-y-3 rounded-xl border border-zinc-200 p-3">
      <div className="flex items-start gap-3"><img src={m.url} alt={m.textoAlternativo || ''} className="h-24 w-28 rounded-lg object-cover" />
        <div className="min-w-0 flex-1 space-y-2">
          <label className="flex items-center gap-2 text-sm text-text"><input type="radio" name="capa" checked={m.capa} onChange={() => alterar(i, { capa: true })} />Imagem de capa</label>
          <label className="block text-sm text-text">Associar ao passo<select value={m.passoChave ?? ''} onChange={e => alterar(i, { passoChave: e.target.value || null })} className="mt-1 block w-full rounded-lg border border-zinc-200 p-2"><option value="">Sem associação</option>{passos.map((p, n) => <option key={p.chave} value={p.chave}>Passo {n + 1}</option>)}</select></label>
        </div>
        <div className="flex flex-col gap-2">
          <button type="button" aria-label={`Mover imagem ${i + 1} para cima`} disabled={i === 0} onClick={() => mover(i, i - 1)} className="text-brand-600 disabled:opacity-30"><ArrowUp className="size-4" /></button>
          <button type="button" aria-label={`Mover imagem ${i + 1} para baixo`} disabled={i === midias.length - 1} onClick={() => mover(i, i + 1)} className="text-brand-600 disabled:opacity-30"><ArrowDown className="size-4" /></button>
          <button type="button" aria-label={`Remover imagem ${i + 1}`} onClick={() => onChange(midias.filter((_, index) => index !== i))} className="text-red-500"><Trash2 className="size-4" /></button>
        </div>
      </div>
      <Input label="Legenda" size="compact" value={m.legenda} maxLength={500} onChange={e => alterar(i, { legenda: e.target.value })} />
      <Input label="Texto alternativo" size="compact" value={m.textoAlternativo} maxLength={500} onChange={e => alterar(i, { textoAlternativo: e.target.value })} />
      <label className="inline-block cursor-pointer text-sm font-medium text-brand-600">Substituir imagem<input type="file" accept="image/png,image/jpeg" className="sr-only" onChange={e => {
        const arquivo = e.target.files?.[0]
        if (!arquivo) return
        if (!['image/png', 'image/jpeg'].includes(arquivo.type) || arquivo.size > 5 * 1024 * 1024) { toast.error('Envie PNG ou JPEG de até 5 MB.'); return }
        const url = URL.createObjectURL(arquivo); onObjectUrl(url)
        alterar(i, { arquivo, url, id: undefined })
      }} /></label>
    </div>)}
    {midias.length < 10 && <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-brand-300 p-5 text-sm font-medium text-brand-600"><Upload className="size-5" />Adicionar imagens<input type="file" multiple accept="image/png,image/jpeg" className="sr-only" onChange={e => { adicionar(e.target.files); e.target.value = '' }} /></label>}
  </section>
}
