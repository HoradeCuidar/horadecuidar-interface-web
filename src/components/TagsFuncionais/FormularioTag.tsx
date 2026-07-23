import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Input, BotaoSalvar, BotaoCancelar } from '@/components'
import type { TagFuncionalCreate } from '@/services/tagFuncional'

export type ValoresFormTag = {
  nome: string
  descricao: string
}

type FormularioTagProps = {
  titulo: string
  descricaoPagina: string
  labelSalvar: string
  valoresIniciais?: ValoresFormTag
  salvando: boolean
  onSubmit: (dados: TagFuncionalCreate) => Promise<void>
  onCancelar: () => void
}

const VALORES_VAZIOS: ValoresFormTag = {
  nome: '',
  descricao: '',
}

export function FormularioTag({
  titulo,
  descricaoPagina,
  labelSalvar,
  valoresIniciais = VALORES_VAZIOS,
  salvando,
  onSubmit,
  onCancelar,
}: FormularioTagProps) {
  const [nome, setNome] = useState(valoresIniciais.nome)
  const [descricao, setDescricao] = useState(valoresIniciais.descricao)

  useEffect(() => {
    setNome(valoresIniciais.nome)
    setDescricao(valoresIniciais.descricao)
  }, [valoresIniciais])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const nomeTrim = nome.trim()
    if (!nomeTrim) {
      toast.error('Informe o nome da tag.')
      return
    }

    await onSubmit({
      nome: nomeTrim,
      descricao: descricao.trim() || null,
    })
  }

  return (
    <form
      onSubmit={(e) => void handleSubmit(e)}
      className="rounded-xl border border-zinc-200 bg-white p-4 shadow-card sm:p-6 md:p-8"
    >
      <header className="mb-6">
        <h1 className="font-heading text-xl font-bold tracking-tight text-text sm:text-2xl">
          {titulo}
        </h1>
        <p className="mt-1 text-sm text-text-muted">{descricaoPagina}</p>
      </header>

      <div className="flex flex-col gap-4">
        <Input
          id="nome-tag"
          label="Nome"
          size="compact"
          placeholder="Ex: Equilíbrio"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          maxLength={100}
        />

        <div>
          <label
            htmlFor="descricao-tag"
            className="mb-1.5 block text-sm font-medium text-text"
          >
            Descrição (opcional)
          </label>
          <textarea
            id="descricao-tag"
            rows={3}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Descreva o uso desta tag"
            maxLength={500}
            className="w-full resize-none rounded-lg border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-text placeholder:text-text-muted transition-colors focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>
      </div>

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <BotaoCancelar type="button" onClick={onCancelar} disabled={salvando}>
          Cancelar
        </BotaoCancelar>
        <BotaoSalvar type="submit" disabled={salvando} className="sm:min-w-48">
          {salvando ? 'Salvando...' : labelSalvar}
        </BotaoSalvar>
      </div>
    </form>
  )
}
