import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import {
  FiActivity,
  FiCheck,
  FiFileText,
  FiZap,
} from 'react-icons/fi'
import { Input, Select, BotaoSalvar, BotaoCancelar } from '@/components'
import { SeletorTags } from '@/components/OrientacoesFuncionais'
import { tagFuncionalService } from '@/services'
import type { TagFuncional } from '@/services/orientacaoFuncional.types'
import {
  OPCOES_ASSIMETRIA,
  OPCOES_FLEXIBILIDADE,
  type AvaliacaoFisicaRequest,
} from '@/services/avaliacaoFisica.types'
import {
  formToRequest,
  VALORES_VAZIOS_AVALIACAO,
  type ValoresFormAvaliacao,
} from './avaliacaoFisica.utils'

type FormularioAvaliacaoFisicaProps = {
  titulo: string
  descricaoPagina: string
  labelSalvar: string
  nomeParticipante?: string
  valoresIniciais?: ValoresFormAvaliacao
  salvando: boolean
  onSubmit: (dados: AvaliacaoFisicaRequest) => Promise<void>
  onCancelar: () => void
}

const textareaClass =
  'w-full resize-y rounded-xl border border-surface-100 bg-white px-3.5 py-2.5 text-sm text-text placeholder:text-text-muted focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500'

function SecaoForm({
  titulo,
  icone,
  children,
}: {
  titulo: string
  icone: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="border-l-4 border-brand-600 pl-4">
      <div className="mb-4 flex items-center gap-2.5">
        <span className="flex size-8 items-center justify-center rounded-lg bg-brand-100 text-brand-700">
          {icone}
        </span>
        <h2 className="font-heading text-base font-bold tracking-tight text-text">
          {titulo}
        </h2>
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  )
}

export function FormularioAvaliacaoFisica({
  titulo,
  descricaoPagina,
  labelSalvar,
  nomeParticipante,
  valoresIniciais = VALORES_VAZIOS_AVALIACAO,
  salvando,
  onSubmit,
  onCancelar,
}: FormularioAvaliacaoFisicaProps) {
  const [form, setForm] = useState<ValoresFormAvaliacao>(valoresIniciais)
  const [tags, setTags] = useState<TagFuncional[]>([])
  const [tagsLoading, setTagsLoading] = useState(true)
  const [tagsErro, setTagsErro] = useState<string | null>(null)

  useEffect(() => {
    setForm(valoresIniciais)
  }, [valoresIniciais])

  useEffect(() => {
    let ativo = true
    setTagsLoading(true)
    setTagsErro(null)
    tagFuncionalService
      .listar()
      .then((lista) => {
        if (ativo) setTags(lista)
      })
      .catch((err) => {
        if (ativo) {
          setTagsErro(
            err instanceof Error ? err.message : 'Erro ao carregar tags.'
          )
        }
      })
      .finally(() => {
        if (ativo) setTagsLoading(false)
      })
    return () => {
      ativo = false
    }
  }, [])

  function setCampo<K extends keyof ValoresFormAvaliacao>(
    campo: K,
    valor: ValoresFormAvaliacao[K]
  ) {
    setForm((prev) => ({ ...prev, [campo]: valor }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const resultado = formToRequest(form)
    if (typeof resultado === 'string') {
      toast.error(resultado)
      return
    }
    await onSubmit(resultado)
  }

  return (
    <form
      onSubmit={(e) => void handleSubmit(e)}
      className="rounded-2xl border border-surface-100 bg-white p-5 shadow-sm sm:p-6 md:p-8"
    >
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-heading text-xl font-bold tracking-tight text-text sm:text-2xl">
            {titulo}
          </h1>
          <p className="mt-1 text-sm text-text-muted">{descricaoPagina}</p>
        </div>
        {nomeParticipante ? (
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-brand-100 px-3 py-1.5 text-xs font-semibold text-brand-700">
            <span className="size-1.5 rounded-full bg-brand-600" aria-hidden />
            Participante: {nomeParticipante}
          </span>
        ) : null}
      </header>

      <div className="flex flex-col gap-8">
        <SecaoForm
          titulo="Atividade física"
          icone={<FiActivity className="size-4" aria-hidden />}
        >
          <label className="flex items-center gap-2 text-sm font-medium text-text">
            <input
              type="checkbox"
              checked={form.realizaAtividadeFisica}
              onChange={(e) =>
                setCampo('realizaAtividadeFisica', e.target.checked)
              }
              className="size-4 rounded border-surface-100 text-brand-600 focus:ring-brand-500"
            />
            Realiza atividade física regular
          </label>

          {form.realizaAtividadeFisica ? (
            <div className="grid gap-4 rounded-xl bg-surface-0 p-4 sm:grid-cols-2">
              <Input
                label="Atividade realizada"
                size="compact"
                value={form.atividadeRealizada}
                onChange={(e) => setCampo('atividadeRealizada', e.target.value)}
                placeholder="Ex.: Musculação e caminhada"
              />
              <Input
                label="Frequência semanal"
                size="compact"
                inputMode="numeric"
                value={form.frequenciaSemanal}
                onChange={(e) => setCampo('frequenciaSemanal', e.target.value)}
                placeholder="Ex.: 3"
              />
            </div>
          ) : null}

          <Select
            label="Flexibilidade"
            size="compact"
            options={OPCOES_FLEXIBILIDADE}
            value={form.flexibilidade}
            onChange={(e) =>
              setCampo(
                'flexibilidade',
                e.target.value as ValoresFormAvaliacao['flexibilidade']
              )
            }
            required
          />
        </SecaoForm>

        <SecaoForm
          titulo="Força muscular e assimetrias"
          icone={<FiZap className="size-4" aria-hidden />}
        >
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-text-muted">
              Força palmar
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Input
                label="Direita"
                size="compact"
                inputMode="decimal"
                value={form.forcaPalmarDireita}
                onChange={(e) => setCampo('forcaPalmarDireita', e.target.value)}
                placeholder="0.0 kg"
              />
              <Input
                label="Esquerda"
                size="compact"
                inputMode="decimal"
                value={form.forcaPalmarEsquerda}
                onChange={(e) => setCampo('forcaPalmarEsquerda', e.target.value)}
                placeholder="0.0 kg"
              />
              <Select
                label="Assimetria"
                size="compact"
                options={OPCOES_ASSIMETRIA}
                value={form.assimetriaPalmar}
                onChange={(e) =>
                  setCampo(
                    'assimetriaPalmar',
                    e.target.value as ValoresFormAvaliacao['assimetriaPalmar']
                  )
                }
              />
            </div>
          </div>

          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-text-muted">
              Força de joelho
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Input
                label="Direita"
                size="compact"
                inputMode="decimal"
                value={form.forcaJoelhoDireita}
                onChange={(e) => setCampo('forcaJoelhoDireita', e.target.value)}
                placeholder="0.0 kg"
              />
              <Input
                label="Esquerda"
                size="compact"
                inputMode="decimal"
                value={form.forcaJoelhoEsquerda}
                onChange={(e) => setCampo('forcaJoelhoEsquerda', e.target.value)}
                placeholder="0.0 kg"
              />
              <Select
                label="Assimetria"
                size="compact"
                options={OPCOES_ASSIMETRIA}
                value={form.assimetriaJoelho}
                onChange={(e) =>
                  setCampo(
                    'assimetriaJoelho',
                    e.target.value as ValoresFormAvaliacao['assimetriaJoelho']
                  )
                }
              />
            </div>
          </div>
        </SecaoForm>

        <SecaoForm
          titulo="Observações"
          icone={<FiFileText className="size-4" aria-hidden />}
        >
          <div>
            <label
              htmlFor="queixas"
              className="mb-1.5 block text-sm font-medium text-text"
            >
              Queixas
            </label>
            <textarea
              id="queixas"
              rows={3}
              value={form.queixas}
              onChange={(e) => setCampo('queixas', e.target.value)}
              placeholder="Descreva os relatos de dor, desconforto ou limitações informadas pelo participante..."
              className={textareaClass}
            />
          </div>
          <div>
            <label
              htmlFor="obs-musculo"
              className="mb-1.5 block text-sm font-medium text-text"
            >
              Observações musculoesqueléticas
            </label>
            <textarea
              id="obs-musculo"
              rows={3}
              value={form.observacoesMusculoEsqueleticas}
              onChange={(e) =>
                setCampo('observacoesMusculoEsqueleticas', e.target.value)
              }
              placeholder="Inspeção postural, amplitude articular, desvios ou tensões observadas..."
              className={textareaClass}
            />
          </div>
          <div>
            <label
              htmlFor="orientacoes"
              className="mb-1.5 block text-sm font-medium text-text"
            >
              Orientações gerais
            </label>
            <textarea
              id="orientacoes"
              rows={3}
              value={form.orientacoesGerais}
              onChange={(e) => setCampo('orientacoesGerais', e.target.value)}
              placeholder="Recomendações ergonômicas, metas de curto prazo e frequência sugerida..."
              className={textareaClass}
            />
          </div>
        </SecaoForm>

        <SeletorTags
          tags={tags}
          selecionadas={form.indicacoesFuncionaisIds}
          onChange={(ids) => setCampo('indicacoesFuncionaisIds', ids)}
          loading={tagsLoading}
          erro={tagsErro}
          titulo="Indicações funcionais (opcional)"
          emptyHint={
            <p className="text-sm text-text-muted">
              Nenhuma tag cadastrada.{' '}
              <Link
                to="/atividades/tags"
                className="font-medium text-brand-700 hover:text-brand-800"
              >
                Cadastre tags
              </Link>{' '}
              para usar como indicações funcionais.
            </p>
          }
        />
      </div>

      <div className="mt-8 flex flex-col-reverse gap-3 border-t border-surface-100 pt-6 sm:flex-row sm:justify-end">
        <BotaoCancelar type="button" onClick={onCancelar} disabled={salvando}>
          Cancelar
        </BotaoCancelar>
        <BotaoSalvar type="submit" disabled={salvando} className="sm:min-w-48">
          {salvando ? (
            'Salvando...'
          ) : (
            <span className="inline-flex items-center gap-1.5">
              <FiCheck className="size-4" aria-hidden />
              {labelSalvar}
            </span>
          )}
        </BotaoSalvar>
      </div>
    </form>
  )
}
