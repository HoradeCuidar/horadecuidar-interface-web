import { useCallback, useEffect, useState } from 'react'
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi'
import { EmptyState, ButtonCadastro } from '@/components'
import emptyMedicamentosSvg from '@/assets/empty-medicamentos.svg'
import { CardPrescricaoNutricional } from '@/components/PrescricaoNutricional/CardPrescricaoNutricional'
import {
  ModalConfirmacaoStatusPrescricaoNutricional,
  type AcaoStatusPrescricaoNutricional,
} from '@/components/PrescricaoNutricional/ModalConfirmacaoStatusPrescricaoNutricional'
import { prescricaoNutricionalService } from '@/services'
import {
  isStatusAtiva,
  type PrescricaoNutricionalResumo,
} from '@/services/prescricaoNutricional.types'

type VisaoAlimentacao = 'ativas' | 'historico'

const CLASSE_BOTAO_VISAO =
  'inline-flex items-center gap-1.5 rounded-xl bg-brand-100 px-3.5 py-2 text-sm font-semibold text-brand-600 transition hover:bg-brand-200 hover:text-brand-700'

type AbaAlimentacaoProps = {
  pacienteId: number
  onNovaPrescricao: () => void
}

export function AbaAlimentacao({
  pacienteId,
  onNovaPrescricao,
}: AbaAlimentacaoProps) {
  const [visao, setVisao] = useState<VisaoAlimentacao>('ativas')
  const [lista, setLista] = useState<PrescricaoNutricionalResumo[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [expandidas, setExpandidas] = useState<Record<number, boolean>>({})
  const [confirmacao, setConfirmacao] = useState<{
    id: number
    acao: AcaoStatusPrescricaoNutricional
  } | null>(null)

  const carregar = useCallback(async () => {
    setLoading(true)
    setErro(null)
    try {
      const todas = await prescricaoNutricionalService.listarPorPaciente(
        pacienteId
      )
      const filtradas =
        visao === 'ativas'
          ? todas.filter((item) => isStatusAtiva(item.status))
          : todas.filter((item) => !isStatusAtiva(item.status))

      setLista(filtradas)
      setExpandidas(() => {
        const proximo: Record<number, boolean> = {}
        for (const p of filtradas) {
          proximo[p.id] = isStatusAtiva(p.status)
        }
        return proximo
      })
    } catch (err) {
      setErro(
        err instanceof Error
          ? err.message
          : visao === 'ativas'
            ? 'Erro ao carregar prescrições nutricionais.'
            : 'Erro ao carregar histórico nutricional.'
      )
      setLista([])
    } finally {
      setLoading(false)
    }
  }, [pacienteId, visao])

  useEffect(() => {
    void carregar()
  }, [carregar])

  function toggle(id: number) {
    setExpandidas((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  async function handleConfirmarStatus() {
    if (!confirmacao) return
    if (confirmacao.acao === 'inativar') {
      await prescricaoNutricionalService.inativar(confirmacao.id)
    } else {
      await prescricaoNutricionalService.ativar(confirmacao.id)
    }
    void carregar()
  }

  const modalStatus = (
    <ModalConfirmacaoStatusPrescricaoNutricional
      aberto={confirmacao !== null}
      acao={confirmacao?.acao ?? 'inativar'}
      onFechar={() => setConfirmacao(null)}
      onConfirmar={handleConfirmarStatus}
    />
  )

  if (loading) {
    return (
      <>
        {modalStatus}
        <div className="flex min-h-[12rem] items-center justify-center rounded-2xl border border-zinc-200 bg-white">
          <p className="text-sm text-text-muted">
            {visao === 'ativas'
              ? 'Carregando prescrições...'
              : 'Carregando histórico...'}
          </p>
        </div>
      </>
    )
  }

  if (erro) {
    return (
      <>
        {modalStatus}
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
      </>
    )
  }

  if (lista.length === 0) {
    return (
      <>
        {modalStatus}
        <div className="flex flex-col gap-4">
          {visao === 'historico' && (
            <div className="flex justify-start">
              <button
                type="button"
                onClick={() => setVisao('ativas')}
                className={CLASSE_BOTAO_VISAO}
              >
                <FiArrowLeft className="size-4" aria-hidden />
                Voltar às prescrições ativas
              </button>
            </div>
          )}

          <EmptyState
            illustration={
              <img
                src={emptyMedicamentosSvg}
                alt=""
                className="mx-auto max-h-[14rem] w-auto sm:max-h-[20rem]"
              />
            }
            title={
              visao === 'ativas'
                ? 'Nenhuma prescrição nutricional encontrada!'
                : 'Nenhuma prescrição no histórico!'
            }
            description={
              visao === 'ativas'
                ? 'Cadastre um plano alimentar para acompanhar a alimentação do paciente.'
                : 'Prescrições inativadas ou encerradas aparecerão aqui.'
            }
            className="min-h-0 rounded-2xl border border-zinc-200 bg-white px-4 py-8 shadow-sm"
          >
            {visao === 'ativas' ? (
              <div className="flex flex-col items-center gap-3">
                <ButtonCadastro
                  label="Nova prescrição nutricional"
                  onClick={onNovaPrescricao}
                />
                <button
                  type="button"
                  onClick={() => setVisao('historico')}
                  className={CLASSE_BOTAO_VISAO}
                >
                  Ver histórico completo de prescrições
                  <FiArrowRight className="size-4" aria-hidden />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setVisao('ativas')}
                className={CLASSE_BOTAO_VISAO}
              >
                <FiArrowLeft className="size-4" aria-hidden />
                Voltar às prescrições ativas
              </button>
            )}
          </EmptyState>
        </div>
      </>
    )
  }

  return (
    <>
      {modalStatus}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {visao === 'historico' ? (
            <button
              type="button"
              onClick={() => setVisao('ativas')}
              className={CLASSE_BOTAO_VISAO}
            >
              <FiArrowLeft className="size-4" aria-hidden />
              Voltar às prescrições ativas
            </button>
          ) : (
            <p className="text-sm font-medium text-zinc-600">
              Prescrições ativas
            </p>
          )}

          {visao === 'ativas' && (
            <ButtonCadastro
              label="Nova prescrição nutricional"
              onClick={onNovaPrescricao}
            />
          )}

          {visao === 'historico' && (
            <p className="text-sm font-medium text-zinc-600">
              Histórico de prescrições
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          {lista.map((item) => (
            <CardPrescricaoNutricional
              key={item.id}
              prescricao={item}
              expandida={Boolean(expandidas[item.id])}
              onToggle={() => toggle(item.id)}
              onInativar={
                visao === 'ativas'
                  ? () => setConfirmacao({ id: item.id, acao: 'inativar' })
                  : undefined
              }
              onAtivar={
                visao === 'historico'
                  ? () => setConfirmacao({ id: item.id, acao: 'ativar' })
                  : undefined
              }
            />
          ))}
        </div>

        {visao === 'ativas' && (
          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={() => setVisao('historico')}
              className={CLASSE_BOTAO_VISAO}
            >
              Ver histórico completo de prescrições
              <FiArrowRight className="size-4" aria-hidden />
            </button>
          </div>
        )}
      </div>
    </>
  )
}
