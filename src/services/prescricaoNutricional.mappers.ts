import {
  criarAlimentoVazio,
  criarRefeicaoVazia,
  type PrescricaoNutricionalFormData,
} from '@/components/PrescricaoNutricional/prescricaoNutricional.types'
import type {
  PrescricaoNutricionalRequest,
  PrescricaoNutricionalResponse,
  PrescricaoNutricionalUpdateRequest,
  UnidadeDeMedida,
} from './prescricaoNutricional.types'

const UNIDADES: UnidadeDeMedida[] = [
  'G',
  'KG',
  'ML',
  'L',
  'UNIDADE',
  'FATIA',
  'COLHER',
  'XICARA',
]

function dataApiParaIso(data: string): string {
  if (!data) return ''
  if (/^\d{4}-\d{2}-\d{2}/.test(data)) return data.slice(0, 10)
  const match = data.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (match) return `${match[3]}-${match[2]}-${match[1]}`
  return data
}

function parseUnidade(valor: string): UnidadeDeMedida | '' {
  const rotulos: Record<string, UnidadeDeMedida> = {
    G: 'G', KG: 'KG', ML: 'ML', LITRO: 'L', UNIDADE: 'UNIDADE',
    FATIA: 'FATIA', COLHER: 'COLHER', XÍCARA: 'XICARA',
  }
  const normalizado = valor.trim().toUpperCase()
  if (rotulos[normalizado]) return rotulos[normalizado]
  return UNIDADES.includes(normalizado as UnidadeDeMedida)
    ? (normalizado as UnidadeDeMedida)
    : ''
}

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
        for (const [indice, sub] of alimento.substituicoes.entries()) {
          if (
            !sub.descricao.trim() ||
            parseQuantidade(sub.quantidade) == null ||
            !sub.unidade ||
            parseOrdem(sub.ordem) == null
          ) {
            return `Preencha a substituição ${indice + 1} do alimento ${p} (opção ${m}, refeição ${n}).`
          }
        }
      }
    }
  }

  return null
}

function mapearRefeicoesForm(form: PrescricaoNutricionalFormData) {
  return form.refeicoes.map((refeicao) => ({
    id: refeicao.persistedId,
    horario: refeicao.horario || null,
    nome: refeicao.nome.trim(),
    ordem: parseOrdem(refeicao.ordem) ?? 1,
    observacoes: refeicao.observacoes.trim() || null,
    opcoes: refeicao.opcoes.map((opcao) => ({
      id: opcao.persistedId,
      orientacoesPreparo: opcao.orientacoesPreparo.trim() || null,
      ordem: parseOrdem(opcao.ordem) ?? 1,
      descricao: opcao.descricao.trim() || null,
      alimentos: opcao.alimentos.map((alimento) => ({
        id: alimento.persistedId,
        medidaCaseira: alimento.medidaCaseira.trim() || null,
        substituicoes: alimento.substituicoes.map((sub) => ({
          id: sub.persistedId,
          ordem: parseOrdem(sub.ordem) ?? 1,
          descricao: sub.descricao.trim(),
          quantidade: parseQuantidade(sub.quantidade) ?? 0,
          unidade: sub.unidade as UnidadeDeMedida,
          medidaCaseira: sub.medidaCaseira.trim() || null,
          observacao: sub.observacao.trim() || null,
        })),
        descricao: alimento.descricao.trim(),
        quantidade: parseQuantidade(alimento.quantidade) ?? 0,
        unidade: alimento.unidade as UnidadeDeMedida,
        observacao: alimento.observacao.trim() || null,
      })),
    })),
  }))
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
    refeicoes: mapearRefeicoesForm(form),
  }
}

export function formToPrescricaoNutricionalUpdateRequest(
  form: PrescricaoNutricionalFormData
): PrescricaoNutricionalUpdateRequest {
  return {
    dataFim: form.dataFim,
    observacoes: form.observacoes.trim() || null,
    refeicoes: mapearRefeicoesForm(form),
  }
}

export function responseToPrescricaoNutricionalForm(
  dto: PrescricaoNutricionalResponse,
  nomeParticipante: string
): PrescricaoNutricionalFormData {
  const refeicoesOrdenadas = [...(dto.refeicoes ?? [])].sort(
    (a, b) => (a.ordem ?? 0) - (b.ordem ?? 0)
  )

  if (refeicoesOrdenadas.length === 0) {
    return {
      nomeParticipante,
      dataInicio: dataApiParaIso(dto.dataInicio),
      dataFim: dataApiParaIso(dto.dataFim),
      observacoes: dto.observacoes ?? '',
      refeicoes: [criarRefeicaoVazia()],
    }
  }

  return {
    nomeParticipante,
    dataInicio: dataApiParaIso(dto.dataInicio),
    dataFim: dataApiParaIso(dto.dataFim),
    observacoes: dto.observacoes ?? '',
    refeicoes: refeicoesOrdenadas.map((refeicao) => {
      const opcoes = [...(refeicao.opcoes ?? [])].sort(
        (a, b) => (a.ordem ?? 0) - (b.ordem ?? 0)
      )
      return {
        id: crypto.randomUUID(),
        persistedId: refeicao.id,
        horario: refeicao.horario ?? '',
        nome: refeicao.nome ?? '',
        ordem: String(refeicao.ordem ?? 1),
        observacoes: refeicao.observacoes ?? '',
        opcoes:
          opcoes.length === 0
            ? [
                {
                  id: crypto.randomUUID(),
                  ordem: '1',
                  descricao: '',
                  orientacoesPreparo: '',
                  alimentos: [criarAlimentoVazio()],
                },
              ]
            : opcoes.map((opcao) => ({
                id: crypto.randomUUID(),
                persistedId: opcao.id,
                orientacoesPreparo: opcao.orientacoesPreparo ?? '',
                ordem: String(opcao.ordem ?? 1),
                descricao: opcao.descricao ?? '',
                alimentos:
                  (opcao.alimentos ?? []).length === 0
                    ? [criarAlimentoVazio()]
                    : (opcao.alimentos ?? []).map((alimento) => ({
                        id: crypto.randomUUID(),
                        persistedId: alimento.id,
                        medidaCaseira: alimento.medidaCaseira ?? '',
                        substituicoes: (alimento.substituicoes ?? []).map((sub) => ({
                          id: crypto.randomUUID(), persistedId: sub.id, ordem: String(sub.ordem),
                          descricao: sub.descricao, quantidade: String(sub.quantidade),
                          unidade: parseUnidade(sub.unidade), medidaCaseira: sub.medidaCaseira ?? '',
                          observacao: sub.observacao ?? '',
                        })),
                        descricao: alimento.descricao ?? '',
                        quantidade: String(alimento.quantidade ?? ''),
                        unidade: parseUnidade(alimento.unidade ?? ''),
                        observacao: alimento.observacao ?? '',
                      })),
              })),
      }
    }),
  }
}
