import { Input } from '@/components'
import { SelectDoenca } from '@/components/SelectDoenca'

type PassoDoencasProps = {
  doencasLista: { value: string; label: string }[]
  doencaIds: string[]
  setDoencaIds: (v: string[]) => void
  onAbrirModalCadastrarDoenca: () => void
  onDeleteDoenca?: (id: string) => void
  onEditDoenca?: (id: string, nome: string) => void
  observacoes: string
  setObservacoes: (v: string) => void
}

export function PassoDoencas({
  doencasLista,
  doencaIds,
  setDoencaIds,
  onAbrirModalCadastrarDoenca,
  onDeleteDoenca,
  onEditDoenca,
  observacoes,
  setObservacoes,
}: PassoDoencasProps) {
  return (
    <section className="space-y-2">
      <div className="grid gap-2 sm:grid-cols-2">
        <SelectDoenca
          options={doencasLista}
          value={doencaIds}
          onSelect={(id) =>
            setDoencaIds(
              doencaIds.includes(id)
                ? doencaIds.filter((selectedId) => selectedId !== id)
                : [...doencaIds, id],
            )
          }
          onAddClick={onAbrirModalCadastrarDoenca}
          onDeleteClick={onDeleteDoenca}
          onEditClick={onEditDoenca}
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
