import { FiCalendar, FiPlus, FiUser } from 'react-icons/fi'
import { MdRestaurant } from 'react-icons/md'
import { Input, BotaoSalvar, BotaoCancelar } from '@/components'
import { FormSecaoNutricional } from './FormSecaoNutricional'
import {
  BOTAO_TRACEJADO,
  TEXTAREA_FORM,
} from './formularioNutricional.styles'
import { SecaoRefeicao } from './SecaoRefeicao'
import type {
  AlimentoForm,
  OpcaoRefeicaoForm,
  PrescricaoNutricionalFormData,
  RefeicaoForm,
} from './prescricaoNutricional.types'

type FormularioPrescricaoNutricionalProps = {
  form: PrescricaoNutricionalFormData
  onChangeCampo: <K extends keyof Omit<PrescricaoNutricionalFormData, 'refeicoes'>>(
    campo: K,
    valor: PrescricaoNutricionalFormData[K]
  ) => void
  onChangeRefeicao: (
    refeicaoId: string,
    campo: keyof Omit<RefeicaoForm, 'id' | 'opcoes'>,
    valor: string
  ) => void
  onChangeOpcao: (
    refeicaoId: string,
    opcaoId: string,
    campo: keyof Omit<OpcaoRefeicaoForm, 'id' | 'alimentos'>,
    valor: string
  ) => void
  onChangeAlimento: (
    refeicaoId: string,
    opcaoId: string,
    alimentoId: string,
    campo: keyof AlimentoForm,
    valor: string
  ) => void
  onAdicionarRefeicao: () => void
  onRemoverRefeicao: (refeicaoId: string) => void
  onAdicionarOpcao: (refeicaoId: string) => void
  onRemoverOpcao: (refeicaoId: string, opcaoId: string) => void
  onAdicionarAlimento: (refeicaoId: string, opcaoId: string) => void
  onRemoverAlimento: (
    refeicaoId: string,
    opcaoId: string,
    alimentoId: string
  ) => void
  onSubmit: (e: React.FormEvent) => void
  onCancelar: () => void
  salvando?: boolean
  modo?: 'criar' | 'editar'
}

export function FormularioPrescricaoNutricional({
  form,
  onChangeCampo,
  onChangeRefeicao,
  onChangeOpcao,
  onChangeAlimento,
  onAdicionarRefeicao,
  onRemoverRefeicao,
  onAdicionarOpcao,
  onRemoverOpcao,
  onAdicionarAlimento,
  onRemoverAlimento,
  onSubmit,
  onCancelar,
  salvando = false,
  modo = 'criar',
}: FormularioPrescricaoNutricionalProps) {
  const editando = modo === 'editar'
  const qtdRefeicoes = form.refeicoes.length

  return (
    <form
      onSubmit={onSubmit}
      className="flex min-h-0 flex-1 flex-col overflow-y-auto rounded-2xl border border-surface-100 bg-white p-5 shadow-sm sm:p-6 md:p-8"
    >
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-heading text-xl font-bold tracking-tight text-text sm:text-2xl">
            {editando
              ? 'Editar prescrição nutricional'
              : 'Prescrição nutricional'}
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            {editando
              ? 'Atualize o período final, observações e o plano de refeições.'
              : 'Cadastre refeições, opções e alimentos do plano alimentar.'}
          </p>
        </div>
        {form.nomeParticipante?.trim() ? (
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-brand-100 px-3 py-1.5 text-xs font-semibold text-brand-700">
            <span className="size-1.5 rounded-full bg-brand-600" aria-hidden />
            Participante: {form.nomeParticipante}
          </span>
        ) : null}
      </header>

      <div className="flex flex-col gap-8">
        <FormSecaoNutricional
          titulo="Dados gerais"
          icone={<FiCalendar className="size-4" aria-hidden />}
        >
          <Input
            label="Nome do participante"
            size="compact"
            value={form.nomeParticipante}
            readOnly
            leftIcon={<FiUser className="size-4 text-text-muted" aria-hidden />}
            className="cursor-default"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Data de início"
              size="compact"
              type="date"
              value={form.dataInicio}
              onChange={(e) => onChangeCampo('dataInicio', e.target.value)}
              required
              readOnly={editando}
              className={editando ? 'cursor-default' : undefined}
            />
            <Input
              label="Data de término"
              size="compact"
              type="date"
              value={form.dataFim}
              onChange={(e) => onChangeCampo('dataFim', e.target.value)}
              required
            />
          </div>

          <div>
            <label
              htmlFor="obs-geral-nutri"
              className="mb-1.5 block text-sm font-medium text-text"
            >
              Observações gerais
            </label>
            <textarea
              id="obs-geral-nutri"
              rows={3}
              value={form.observacoes}
              onChange={(e) => onChangeCampo('observacoes', e.target.value)}
              placeholder="Orientações gerais do plano alimentar (opcional)"
              className={TEXTAREA_FORM}
            />
          </div>
        </FormSecaoNutricional>

        <FormSecaoNutricional
          titulo="Refeições do plano"
          icone={<MdRestaurant className="size-4" aria-hidden />}
          acao={
            <span className="rounded-full bg-surface-0 px-2.5 py-1 text-[11px] font-semibold text-text-muted">
              {qtdRefeicoes} {qtdRefeicoes === 1 ? 'refeição' : 'refeições'}
            </span>
          }
        >
          <div className="flex flex-col gap-4">
            {form.refeicoes.map((refeicao, i) => (
              <SecaoRefeicao
                key={refeicao.id}
                refeicao={refeicao}
                indice={i}
                podeRemover={form.refeicoes.length > 1}
                onChangeRefeicao={onChangeRefeicao}
                onChangeOpcao={onChangeOpcao}
                onChangeAlimento={onChangeAlimento}
                onAdicionarOpcao={onAdicionarOpcao}
                onRemoverOpcao={onRemoverOpcao}
                onAdicionarAlimento={onAdicionarAlimento}
                onRemoverAlimento={onRemoverAlimento}
                onRemoverRefeicao={onRemoverRefeicao}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={onAdicionarRefeicao}
            className={BOTAO_TRACEJADO}
          >
            <FiPlus className="size-4" aria-hidden />
            Adicionar refeição
          </button>
        </FormSecaoNutricional>
      </div>

      <div className="mt-8 flex flex-col-reverse gap-3 border-t border-surface-100 pt-6 sm:flex-row sm:justify-end">
        <BotaoCancelar type="button" onClick={onCancelar} disabled={salvando}>
          Cancelar
        </BotaoCancelar>
        <BotaoSalvar type="submit" disabled={salvando} className="sm:min-w-48">
          {salvando
            ? 'Salvando...'
            : editando
              ? 'Salvar alterações'
              : 'Salvar prescrição'}
        </BotaoSalvar>
      </div>
    </form>
  )
}
