import type { PrescricaoFormData } from '@/components/PrescricaoMedicamentos/prescricao.types'
import type {
  MedicamentoListagem,
  PrescricaoListagem,
  StatusPrescricao,
} from '@/components/PrescricaoMedicamentos/prescricaoListagem.types'
import {
  OPCOES_UNIDADE_DOSAGEM,
  OPCOES_UNIDADE_FREQUENCIA,
  OPCOES_VIA_ADMINISTRACAO,
} from '@/components/PrescricaoMedicamentos/prescricao.types'

export type ItemMedicacaoRequest = {
  nomeMedicamento: string
  dosagemValor: number
  dosagemUnidade: string
  quantidadeDoses: number
  intervaloValor: number
  intervaloTipo: string
  viaAdministracao: string
  observacao?: string | null
}

export type PrescricaoMedicamentoRequest = {
  dataInicio: string
  dataFim?: string | null
  observacao?: string | null
  medicacoes: ItemMedicacaoRequest[]
}

export type ItemMedicacaoResponse = {
  nomeMedicamento: string
  dosagemValor: number
  dosagemUnidade: string
  quantidadeDoses: number
  intervaloValor: number
  intervaloTipo: string
  viaAdministracao: string
  observacao?: string | null
}

export type PrescricaoMedicamentoResponse = {
  id: string
  nomeProfissional?: string
  dataInicio: string
  dataFim?: string | null
  observacao?: string | null
  ativo: boolean
  medicacoes: ItemMedicacaoResponse[]
}

function labelDe(
  opcoes: { value: string; label: string }[],
  value: string
): string {
  return opcoes.find((o) => o.value === value)?.label ?? value
}

function toIsoDate(value: string | Date | null | undefined): string {
  if (!value) return ''
  if (typeof value === 'string') return value.slice(0, 10)
  return value.toISOString().slice(0, 10)
}

function statusDeResposta(
  ativo: boolean,
  dataFim?: string | null
): StatusPrescricao {
  if (!ativo) return 'encerrada'
  if (dataFim) {
    const fim = toIsoDate(dataFim)
    const hoje = new Date().toISOString().slice(0, 10)
    if (fim < hoje) return 'encerrada'
  }
  return 'ativa'
}

function frequenciaLabel(doses: number, intervalo: number, tipo: string): string {
  const unidade = labelDe(OPCOES_UNIDADE_FREQUENCIA, tipo)
  return `${doses} vez(es) a cada ${intervalo} ${unidade}`
}

export function formToPrescricaoRequest(
  form: PrescricaoFormData
): PrescricaoMedicamentoRequest {
  return {
    dataInicio: form.dataInicio,
    dataFim: form.dataTermino || null,
    observacao: form.observacaoGeral.trim() || null,
    medicacoes: form.medicamentos.map((med) => ({
      nomeMedicamento: med.nome.trim(),
      dosagemValor: Number(med.dosagem.replace(',', '.')),
      dosagemUnidade: med.unidadeDosagem,
      quantidadeDoses: Number(med.frequenciaVezes) || 1,
      intervaloValor: Number(med.frequenciaIntervalo) || 1,
      intervaloTipo: med.frequenciaUnidade,
      viaAdministracao: med.viaAdministracao,
      observacao: med.observacao.trim() || null,
    })),
  }
}

export function responseToListagem(
  dto: PrescricaoMedicamentoResponse
): PrescricaoListagem {
  const dataInicio = toIsoDate(dto.dataInicio)
  const dataTermino = toIsoDate(dto.dataFim)

  const medicamentos: MedicamentoListagem[] = (dto.medicacoes ?? []).map(
    (item, index) => ({
      id: `${dto.id}-${index}`,
      nome: item.nomeMedicamento,
      dosagemLabel: `${item.dosagemValor}${labelDe(OPCOES_UNIDADE_DOSAGEM, item.dosagemUnidade)}`,
      quantidadeLabel: `${item.quantidadeDoses} dose(s)`,
      frequenciaLabel: frequenciaLabel(
        item.quantidadeDoses,
        item.intervaloValor,
        item.intervaloTipo
      ),
      viaLabel: labelDe(OPCOES_VIA_ADMINISTRACAO, item.viaAdministracao),
    })
  )

  return {
    id: String(dto.id),
    status: statusDeResposta(dto.ativo, dataTermino),
    dataInicio,
    dataTermino,
    medicamentos,
  }
}

export function responsesToListagem(
  lista: PrescricaoMedicamentoResponse[]
): PrescricaoListagem[] {
  return lista.map(responseToListagem)
}
