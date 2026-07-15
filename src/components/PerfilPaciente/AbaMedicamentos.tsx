import { useCallback, useEffect, useState } from 'react'
import { FiArrowRight } from 'react-icons/fi'
import { toast } from 'sonner'
import { EmptyState, ButtonCadastro } from '@/components'
import emptyMedicamentosSvg from '@/assets/empty-medicamentos.svg'
import { CardPrescricao } from '@/components/PrescricaoMedicamentos/CardPrescricao'
import type { PrescricaoListagem } from '@/components/PrescricaoMedicamentos/prescricaoListagem.types'
import { prescricaoMedicamentoService } from '@/services'

type AbaMedicamentosProps = {
  pacienteId: number
  onNovaPrescricao: () => void
  onEditarPrescricao: (prescricaoId: string) => void
}

export function AbaMedicamentos({
  pacienteId,
  onNovaPrescricao,
  onEditarPrescricao,
}: AbaMedicamentosProps) {
  const [lista, setLista] = useState<PrescricaoListagem[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [expandidas, setExpandidas] = useState<Record<string, boolean>>({})

  const carregar = useCallback(async () => {
    setLoading(true)
    setErro(null)
    try {
      const dados = await prescricaoMedicamentoService.listarAtivas(pacienteId)
      setLista(dados)
      setExpandidas((prev) => {
        const proximo: Record<string, boolean> = {}
        for (const p of dados) {
          proximo[p.id] = prev[p.id] ?? p.status === 'ativa'
        }
        return proximo
      })
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro ao carregar prescrições.')
      setLista([])
    } finally {
      setLoading(false)
    }
  }, [pacienteId])

  useEffect(() => {
    void carregar()
  }, [carregar])

  function toggle(id: string) {
    setExpandidas((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  if (loading) {
    return (
      <div className="flex min-h-[12rem] items-center justify-center rounded-2xl border border-zinc-200 bg-white">
        <p className="text-sm text-text-muted">Carregando prescrições...</p>
      </div>
    )
  }

  if (erro) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-4 py-10">
        <p className="text-center text-sm text-red-600">{erro}</p>
        <button
          type="button"
          onClick={() => void carregar()}
          className="text-sm font-medium text-brand-500 hover:text-brand-600"
        >
          Tentar novamente
        </button>
      </div>
    )
  }

  if (lista.length === 0) {
    return (
      <EmptyState
        illustration={
          <img
            src={emptyMedicamentosSvg}
            alt=""
            className="mx-auto max-h-[14rem] w-auto sm:max-h-[20rem]"
          />
        }
        title="Nenhuma prescrição de medicamento encontrada!"
        description="Adicione uma nova prescrição para acompanhar o tratamento do paciente."
        className="min-h-0 rounded-2xl border border-zinc-200 bg-white px-4 py-8 shadow-sm"
      >
        <ButtonCadastro label="Nova prescrição" onClick={onNovaPrescricao} />
      </EmptyState>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <ButtonCadastro label="Nova prescrição" onClick={onNovaPrescricao} />
      </div>

      <div className="flex flex-col gap-3">
        {lista.map((item) => (
          <CardPrescricao
            key={item.id}
            prescricao={item}
            expandida={Boolean(expandidas[item.id])}
            onToggle={() => toggle(item.id)}
            onEditar={() => onEditarPrescricao(item.id)}
          />
        ))}
      </div>

      <div className="flex justify-center pt-2">
        <button
          type="button"
          onClick={() => toast.message('Histórico completo em breve.')}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-500 transition hover:text-brand-600"
        >
          Ver histórico completo de prescrições
          <FiArrowRight className="size-4" aria-hidden />
        </button>
      </div>
    </div>
  )
}
