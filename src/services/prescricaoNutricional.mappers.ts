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
  if (!/^[1-9]\d*$/.test(trim)) return null
  const n = Number(trim)
  return Number.isSafeInteger(n) ? n : null
}

export type ErrosPrescricaoNutricional = Record<string, string>

export function obterErrosPrescricaoNutricionalForm(
  form: PrescricaoNutricionalFormData,
  validarDatas = true
): ErrosPrescricaoNutricional {
  const erros: ErrosPrescricaoNutricional = {}
  if (validarDatas && !form.dataInicio.trim()) erros.dataInicio = 'Informe a data de início.'
  if (validarDatas && !form.dataFim.trim()) erros.dataFim = 'Informe a data de término.'
  if (validarDatas && form.dataInicio && form.dataFim && form.dataFim < form.dataInicio) {
    erros.dataFim = 'A data de término não pode ser anterior à data de início.'
  }
  if (form.refeicoes.length === 0) erros.refeicoes = 'Adicione pelo menos uma refeição.'

  for (let i = 0; i < form.refeicoes.length; i++) {
    const refeicao = form.refeicoes[i]
    const n = i + 1
    if (!refeicao.nome.trim()) erros[`${refeicao.id}.nome`] = `Informe o nome da refeição ${n}.`
    if (parseOrdem(refeicao.ordem) == null) {
      erros[`${refeicao.id}.ordem`] = `Informe a ordem da refeição ${n} (mínimo 1).`
    }
    if (refeicao.opcoes.length === 0) {
      erros[`${refeicao.id}.opcoes`] = `A refeição ${n} deve ter pelo menos uma opção.`
    }

    for (let j = 0; j < refeicao.opcoes.length; j++) {
      const opcao = refeicao.opcoes[j]
      const m = j + 1
      if (parseOrdem(opcao.ordem) == null) {
        erros[`${opcao.id}.ordem`] = `Informe a ordem da opção ${m} da refeição ${n}.`
      }
      if (opcao.alimentos.length === 0) {
        erros[`${opcao.id}.alimentos`] = `A opção ${m} da refeição ${n} deve ter pelo menos um alimento.`
      }

      for (let k = 0; k < opcao.alimentos.length; k++) {
        const alimento = opcao.alimentos[k]
        const p = k + 1
        if (!alimento.descricao.trim()) {
          erros[`${alimento.id}.descricao`] = `Informe a descrição do alimento ${p} (opção ${m}, refeição ${n}).`
        }
        if (parseQuantidade(alimento.quantidade) == null) {
          erros[`${alimento.id}.quantidade`] = `Informe a quantidade válida do alimento ${p} (opção ${m}, refeição ${n}).`
        }
        if (!alimento.unidade) {
          erros[`${alimento.id}.unidade`] = `Selecione a unidade do alimento ${p} (opção ${m}, refeição ${n}).`
        }
        for (const [indice, sub] of alimento.substituicoes.entries()) {
          const contexto = `substituição ${indice + 1} do alimento ${p} (opção ${m}, refeição ${n})`
          if (!sub.descricao.trim()) erros[`${sub.id}.descricao`] = `Informe a descrição da ${contexto}.`
          if (parseOrdem(sub.ordem) == null) erros[`${sub.id}.ordem`] = `Informe a ordem da ${contexto}.`
          if (parseQuantidade(sub.quantidade) == null) erros[`${sub.id}.quantidade`] = `Informe a quantidade válida da ${contexto}.`
          if (!sub.unidade) erros[`${sub.id}.unidade`] = `Selecione a unidade da ${contexto}.`
        }
      }
    }
  }

  return erros
}

export function validarPrescricaoNutricionalForm(
  form: PrescricaoNutricionalFormData,
  validarDatas = true
): string | null {
  return Object.values(obterErrosPrescricaoNutricionalForm(form, validarDatas))[0] ?? null
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

/** Copia apenas o plano; a nova prescrição recebe IDs e vigência próprios. */
export function copiarPrescricaoNutricionalParaNova(
  dto: PrescricaoNutricionalResponse,
  nomeParticipante: string
): PrescricaoNutricionalFormData {
  const form = responseToPrescricaoNutricionalForm(dto, nomeParticipante)
  return {
    ...form,
    dataInicio: '',
    dataFim: '',
    refeicoes: form.refeicoes.map((refeicao) => ({
      ...refeicao,
      persistedId: undefined,
      opcoes: refeicao.opcoes.map((opcao) => ({
        ...opcao,
        persistedId: undefined,
        alimentos: opcao.alimentos.map((alimento) => ({
          ...alimento,
          persistedId: undefined,
          substituicoes: alimento.substituicoes.map((substituicao) => ({
            ...substituicao,
            persistedId: undefined,
          })),
        })),
      })),
    })),
  }
}
