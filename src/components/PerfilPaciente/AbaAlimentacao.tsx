import { useCallback, useEffect, useState } from 'react'
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi'
import { EmptyState, ButtonCadastro } from '@/components'
import emptyMedicamentosSvg from '@/assets/empty-medicamentos.svg'
import { CalendarioAdesaoPainel } from '@/components/CalendarioSemana'
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
  'inline-flex items-center gap-1.5 rounded-xl bg-brand-100 px-3.5 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700'

type AbaAlimentacaoProps = {
  pacienteId: number
  onNovaPrescricao: () => void
  onEditarPrescricao: (prescricaoId: number) => void
}

export function AbaAlimentacao({
  pacienteId,
  onNovaPrescricao,
  onEditarPrescricao,
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
      setExpandidas({})
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

  const calendario = (
    <CalendarioAdesaoPainel
      pacienteId={pacienteId}
      dominio="nutricional"
      enabled={visao === 'ativas'}
    />
  )

  if (loading) {
    return (
      <>
        {modalStatus}
        <div className="flex flex-col gap-4">
          {calendario}
          <div className="flex min-h-[12rem] items-center justify-center rounded-2xl border border-surface-100 bg-white shadow-sm">
            <p className="text-sm text-text-muted">
              {visao === 'ativas'
                ? 'Carregando prescrições...'
                : 'Carregando histórico...'}
            </p>
          </div>
        </div>
      </>
    )
  }

  if (erro) {
    return (
      <>
        {modalStatus}
        <div className="flex flex-col gap-4">
          {calendario}
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-surface-100 bg-white px-4 py-10 shadow-sm">
            <p className="text-center text-sm text-error-500" role="alert">
              {erro}
            </p>
            <button
              type="button"
              onClick={() => void carregar()}
              className="text-sm font-medium text-brand-700 hover:text-brand-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </>
    )
  }

  if (lista.length === 0) {
    return (
      <>
        {modalStatus}
        <div className="flex flex-col gap-4">
          {calendario}
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
                ? 'Cadastre um plano alimentar para acompanhar a alimentação do participante.'
                : 'Prescrições inativadas ou encerradas aparecerão aqui.'
            }
            className="min-h-0 rounded-2xl border border-surface-100 bg-white px-4 py-8 shadow-sm"
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
        {calendario}

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
            <div>
              <h2 className="font-heading text-base font-semibold text-text">
                Prescrições ativas
              </h2>
              <p className="mt-0.5 text-xs text-text-muted">
                Planos alimentares em acompanhamento
              </p>
            </div>
          )}

          {visao === 'ativas' && (
            <ButtonCadastro
              label="Nova prescrição nutricional"
              onClick={onNovaPrescricao}
            />
          )}

          {visao === 'historico' && (
            <div>
              <h2 className="font-heading text-base font-semibold text-text">
                Histórico de prescrições
              </h2>
              <p className="mt-0.5 text-xs text-text-muted">
                Planos inativos ou encerrados
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          {lista.map((item) => (
            <CardPrescricaoNutricional
              key={item.id}
              prescricao={item}
              expandida={Boolean(expandidas[item.id])}
              onToggle={() => toggle(item.id)}
              onEditar={
                visao === 'ativas'
                  ? () => onEditarPrescricao(item.id)
                  : undefined
              }
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
