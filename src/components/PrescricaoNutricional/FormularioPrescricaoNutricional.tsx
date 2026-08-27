import { FiPlus, FiUser } from 'react-icons/fi'
import { Input, BotaoSalvar, BotaoCancelar } from '@/components'
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
}: FormularioPrescricaoNutricionalProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="flex min-h-0 flex-1 flex-col overflow-y-auto rounded-2xl bg-white p-4 shadow-card sm:p-6 md:p-8"
    >
      <div className="mb-5 sm:mb-6">
        <h2 className="font-heading text-lg font-bold text-brand-600 sm:text-xl md:text-2xl">
          Prescrição nutricional
        </h2>
        <p className="mt-1 text-xs text-text-muted sm:text-sm">
          Cadastre refeições, opções e alimentos do plano alimentar.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <Input
          label="Nome do Participante"
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
            rows={2}
            value={form.observacoes}
            onChange={(e) => onChangeCampo('observacoes', e.target.value)}
            className="w-full resize-none rounded-lg border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-text placeholder:text-text-muted focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>

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
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-brand-400 bg-transparent py-3 text-sm font-semibold text-brand-500 transition hover:bg-brand-50 sm:w-auto sm:px-6"
        >
          <FiPlus className="size-4" aria-hidden />
          Adicionar refeição
        </button>
      </div>

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <BotaoCancelar type="button" onClick={onCancelar} disabled={salvando}>
          Cancelar
        </BotaoCancelar>
        <BotaoSalvar type="submit" disabled={salvando} className="sm:min-w-48">
          {salvando ? 'Salvando...' : 'Salvar prescrição'}
        </BotaoSalvar>
      </div>
    </form>
  )
}
