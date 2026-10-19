import { useCallback, useEffect, useState } from 'react'
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi'
import { EmptyState, ButtonCadastro } from '@/components'
import emptyMedicamentosSvg from '@/assets/empty-medicamentos.svg'
import { CalendarioAdesaoPainel } from '@/components/CalendarioSemana'
import { CardPrescricao } from '@/components/PrescricaoMedicamentos/CardPrescricao'
import { ModalConfirmacaoEncerrarPrescricao } from '@/components/PrescricaoMedicamentos/ModalConfirmacaoEncerrarPrescricao'
import type { PrescricaoListagem } from '@/components/PrescricaoMedicamentos/prescricaoListagem.types'
import { prescricaoMedicamentoService } from '@/services'

type VisaoMedicamentos = 'ativas' | 'historico'

const CLASSE_BOTAO_VISAO =
  'inline-flex items-center gap-1.5 rounded-xl bg-brand-100 px-3.5 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700'

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
  const [visao, setVisao] = useState<VisaoMedicamentos>('ativas')
  const [lista, setLista] = useState<PrescricaoListagem[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [expandidas, setExpandidas] = useState<Record<string, boolean>>({})
  const [prescricaoEncerrarId, setPrescricaoEncerrarId] = useState<string | null>(
    null
  )

  const carregar = useCallback(async () => {
    setLoading(true)
    setErro(null)
    try {
      const dados =
        visao === 'ativas'
          ? await prescricaoMedicamentoService.listarAtivas(pacienteId)
          : await prescricaoMedicamentoService.listarHistorico(pacienteId)
      setLista(dados)
      setExpandidas({})
    } catch (err) {
      setErro(
        err instanceof Error
          ? err.message
          : visao === 'ativas'
            ? 'Erro ao carregar prescrições.'
            : 'Erro ao carregar histórico.'
      )
      setLista([])
    } finally {
      setLoading(false)
    }
  }, [pacienteId, visao])

  useEffect(() => {
    void carregar()
  }, [carregar])

  function toggle(id: string) {
    setExpandidas((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  async function handleConfirmarEncerrar() {
    if (!prescricaoEncerrarId) return
    await prescricaoMedicamentoService.alterarStatus(
      pacienteId,
      prescricaoEncerrarId
    )
    void carregar()
  }

  const modalEncerrar = (
    <ModalConfirmacaoEncerrarPrescricao
      aberto={prescricaoEncerrarId !== null}
      onFechar={() => setPrescricaoEncerrarId(null)}
      onConfirmar={handleConfirmarEncerrar}
    />
  )

  const calendario = (
    <CalendarioAdesaoPainel
      pacienteId={pacienteId}
      dominio="medicamentos"
      enabled={visao === 'ativas'}
    />
  )

  if (loading) {
    return (
      <>
        {modalEncerrar}
        <div className="flex flex-col gap-4">
          {calendario}
          <div className="flex min-h-[12rem] items-center justify-center rounded-2xl border border-zinc-200 bg-white">
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
        {modalEncerrar}
        <div className="flex flex-col gap-4">
          {calendario}
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-4 py-10">
            <p className="text-center text-sm text-error-500">{erro}</p>
            <button
              type="button"
              onClick={() => void carregar()}
              className="text-sm font-medium text-brand-700 hover:text-brand-800"
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
        {modalEncerrar}
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
                ? 'Nenhuma prescrição de medicamento encontrada!'
                : 'Nenhuma prescrição no histórico!'
            }
            description={
              visao === 'ativas'
                ? 'Adicione uma nova prescrição para acompanhar o tratamento do participante.'
                : 'Prescrições encerradas ou vencidas aparecerão aqui.'
            }
            className="min-h-0 rounded-2xl border border-zinc-200 bg-white px-4 py-8 shadow-sm"
          >
            {visao === 'ativas' ? (
              <div className="flex flex-col items-center gap-3">
                <ButtonCadastro
                  label="Nova prescrição"
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
      {modalEncerrar}
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
            <p className="text-sm font-medium text-text-muted">Prescrições ativas</p>
          )}

          {visao === 'ativas' && (
            <ButtonCadastro label="Nova prescrição" onClick={onNovaPrescricao} />
          )}

          {visao === 'historico' && (
            <p className="text-sm font-medium text-text-muted">Histórico de prescrições</p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          {lista.map((item) => (
            <CardPrescricao
              key={item.id}
              pacienteId={pacienteId}
              prescricao={item}
              expandida={Boolean(expandidas[item.id])}
              onToggle={() => toggle(item.id)}
              onEditar={
                visao === 'ativas' ? () => onEditarPrescricao(item.id) : undefined
              }
              onEncerrar={
                visao === 'ativas'
                  ? () => setPrescricaoEncerrarId(item.id)
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
