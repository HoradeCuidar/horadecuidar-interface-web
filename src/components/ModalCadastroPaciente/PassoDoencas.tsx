import { Input } from '@/components'
import { SelectDoenca } from '@/components/SelectDoenca'

type PassoDoencasProps = {
  doencasLista: { value: string; label: string }[]
  doencaId: string
  setDoencaId: (v: string) => void
  onAbrirModalCadastrarDoenca: () => void
  observacoes: string
  setObservacoes: (v: string) => void
}

export function PassoDoencas({
  doencasLista,
  doencaId,
  setDoencaId,
  onAbrirModalCadastrarDoenca,
  observacoes,
  setObservacoes,
}: PassoDoencasProps) {
  return (
    <section className="space-y-2">
      <div className="grid gap-2 sm:grid-cols-2">
        <SelectDoenca
          options={doencasLista}
          value={doencaId}
          onSelect={setDoencaId}
          onAddClick={onAbrirModalCadastrarDoenca}
        />
        <Input
          size="compact"
          label="Observações clínicas"
          placeholder="Digite as observações"
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
          className="sm:col-span-2"
        />
      </div>
    </section>
  )
}
