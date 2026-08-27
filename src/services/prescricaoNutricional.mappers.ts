import type { PrescricaoNutricionalFormData } from '@/components/PrescricaoNutricional/prescricaoNutricional.types'
import type {
  PrescricaoNutricionalRequest,
  UnidadeDeMedida,
} from './prescricaoNutricional.types'

function parseQuantidade(valor: string): number | null {
  const trim = valor.trim().replace(',', '.')
  if (!trim) return null
  const n = Number(trim)
  return Number.isFinite(n) && n > 0 ? n : null
}

function parseOrdem(valor: string): number | null {
  const trim = valor.trim()
  if (!trim) return null
  const n = Number.parseInt(trim, 10)
  return Number.isFinite(n) && n >= 1 ? n : null
}

export function validarPrescricaoNutricionalForm(
  form: PrescricaoNutricionalFormData
): string | null {
  if (!form.dataInicio.trim()) return 'Informe a data de início.'
  if (!form.dataFim.trim()) return 'Informe a data de término.'
  if (form.dataFim < form.dataInicio) {
    return 'A data de término não pode ser anterior à data de início.'
  }
  if (form.refeicoes.length === 0) {
    return 'Adicione pelo menos uma refeição.'
  }

  for (let i = 0; i < form.refeicoes.length; i++) {
    const refeicao = form.refeicoes[i]
    const n = i + 1
    if (!refeicao.nome.trim()) return `Informe o nome da refeição ${n}.`
    if (parseOrdem(refeicao.ordem) == null) {
      return `Informe a ordem da refeição ${n} (mínimo 1).`
    }
    if (refeicao.opcoes.length === 0) {
      return `A refeição ${n} deve ter pelo menos uma opção.`
    }

    for (let j = 0; j < refeicao.opcoes.length; j++) {
      const opcao = refeicao.opcoes[j]
      const m = j + 1
      if (parseOrdem(opcao.ordem) == null) {
        return `Informe a ordem da opção ${m} da refeição ${n}.`
      }
      if (opcao.alimentos.length === 0) {
        return `A opção ${m} da refeição ${n} deve ter pelo menos um alimento.`
      }

      for (let k = 0; k < opcao.alimentos.length; k++) {
        const alimento = opcao.alimentos[k]
        const p = k + 1
        if (!alimento.descricao.trim()) {
          return `Informe a descrição do alimento ${p} (opção ${m}, refeição ${n}).`
        }
        if (parseQuantidade(alimento.quantidade) == null) {
          return `Informe a quantidade válida do alimento ${p} (opção ${m}, refeição ${n}).`
        }
        if (!alimento.unidade) {
          return `Selecione a unidade do alimento ${p} (opção ${m}, refeição ${n}).`
        }
      }
    }
  }

  return null
}

export function formToPrescricaoNutricionalRequest(
  pacienteId: number,
  form: PrescricaoNutricionalFormData
): PrescricaoNutricionalRequest {
  return {
    pacienteId,
    dataInicio: form.dataInicio,
    dataFim: form.dataFim,
    observacoes: form.observacoes.trim() || null,
    refeicoes: form.refeicoes.map((refeicao) => ({
      nome: refeicao.nome.trim(),
      ordem: parseOrdem(refeicao.ordem) ?? 1,
      observacoes: refeicao.observacoes.trim() || null,
      opcoes: refeicao.opcoes.map((opcao) => ({
        ordem: parseOrdem(opcao.ordem) ?? 1,
        descricao: opcao.descricao.trim() || null,
        alimentos: opcao.alimentos.map((alimento) => ({
          descricao: alimento.descricao.trim(),
          quantidade: parseQuantidade(alimento.quantidade) ?? 0,
          unidade: alimento.unidade as UnidadeDeMedida,
          observacao: alimento.observacao.trim() || null,
        })),
      })),
    })),
  }
}
