import { useState } from 'react'
import {
  criarAlimentoVazio,
  criarFormularioVazio,
  criarOpcaoVazia,
  criarRefeicaoVazia,
  type AlimentoForm,
  type OpcaoRefeicaoForm,
  type PrescricaoNutricionalFormData,
  type RefeicaoForm,
} from '@/components/PrescricaoNutricional'

export function usePrescricaoNutricionalForm(
  inicial?: PrescricaoNutricionalFormData
) {
  const [form, setForm] = useState<PrescricaoNutricionalFormData>(
    inicial ?? criarFormularioVazio()
  )

  function setFormCompleto(proximo: PrescricaoNutricionalFormData) {
    setForm(proximo)
  }

  function handleChangeCampo<
    K extends keyof Omit<PrescricaoNutricionalFormData, 'refeicoes'>,
  >(campo: K, valor: PrescricaoNutricionalFormData[K]) {
    setForm((prev) => ({ ...prev, [campo]: valor }))
  }

  function handleChangeRefeicao(
    refeicaoId: string,
    campo: keyof Omit<RefeicaoForm, 'id' | 'opcoes'>,
    valor: string
  ) {
    setForm((prev) => ({
      ...prev,
      refeicoes: prev.refeicoes.map((r) =>
        r.id === refeicaoId ? { ...r, [campo]: valor } : r
      ),
    }))
  }

  function handleChangeOpcao(
    refeicaoId: string,
    opcaoId: string,
    campo: keyof Omit<OpcaoRefeicaoForm, 'id' | 'alimentos'>,
    valor: string
  ) {
    setForm((prev) => ({
      ...prev,
      refeicoes: prev.refeicoes.map((r) =>
        r.id !== refeicaoId
          ? r
          : {
              ...r,
              opcoes: r.opcoes.map((o) =>
                o.id === opcaoId ? { ...o, [campo]: valor } : o
              ),
            }
      ),
    }))
  }

  function handleChangeAlimento(
    refeicaoId: string,
    opcaoId: string,
    alimentoId: string,
    campo: keyof AlimentoForm,
    valor: string
  ) {
    setForm((prev) => ({
      ...prev,
      refeicoes: prev.refeicoes.map((r) =>
        r.id !== refeicaoId
          ? r
          : {
              ...r,
              opcoes: r.opcoes.map((o) =>
                o.id !== opcaoId
                  ? o
                  : {
                      ...o,
                      alimentos: o.alimentos.map((a) =>
                        a.id === alimentoId ? { ...a, [campo]: valor } : a
                      ),
                    }
              ),
            }
      ),
    }))
  }

  function handleAdicionarRefeicao() {
    setForm((prev) => ({
      ...prev,
      refeicoes: [
        ...prev.refeicoes,
        criarRefeicaoVazia(prev.refeicoes.length + 1),
      ],
    }))
  }

  function handleRemoverRefeicao(refeicaoId: string) {
    setForm((prev) => ({
      ...prev,
      refeicoes: prev.refeicoes.filter((r) => r.id !== refeicaoId),
    }))
  }

  function handleAdicionarOpcao(refeicaoId: string) {
    setForm((prev) => ({
      ...prev,
      refeicoes: prev.refeicoes.map((r) =>
        r.id !== refeicaoId
          ? r
          : {
              ...r,
              opcoes: [...r.opcoes, criarOpcaoVazia(r.opcoes.length + 1)],
            }
      ),
    }))
  }

  function handleRemoverOpcao(refeicaoId: string, opcaoId: string) {
    setForm((prev) => ({
      ...prev,
      refeicoes: prev.refeicoes.map((r) =>
        r.id !== refeicaoId
          ? r
          : { ...r, opcoes: r.opcoes.filter((o) => o.id !== opcaoId) }
      ),
    }))
  }

  function handleAdicionarAlimento(refeicaoId: string, opcaoId: string) {
    setForm((prev) => ({
      ...prev,
      refeicoes: prev.refeicoes.map((r) =>
        r.id !== refeicaoId
          ? r
          : {
              ...r,
              opcoes: r.opcoes.map((o) =>
                o.id !== opcaoId
                  ? o
                  : { ...o, alimentos: [...o.alimentos, criarAlimentoVazio()] }
              ),
            }
      ),
    }))
  }

  function handleRemoverAlimento(
    refeicaoId: string,
    opcaoId: string,
    alimentoId: string
  ) {
    setForm((prev) => ({
      ...prev,
      refeicoes: prev.refeicoes.map((r) =>
        r.id !== refeicaoId
          ? r
          : {
              ...r,
              opcoes: r.opcoes.map((o) =>
                o.id !== opcaoId
                  ? o
                  : {
                      ...o,
                      alimentos: o.alimentos.filter((a) => a.id !== alimentoId),
                    }
              ),
            }
      ),
    }))
  }

  return {
    form,
    setFormCompleto,
    handleChangeCampo,
    handleChangeRefeicao,
    handleChangeOpcao,
    handleChangeAlimento,
    handleAdicionarRefeicao,
    handleRemoverRefeicao,
    handleAdicionarOpcao,
    handleRemoverOpcao,
    handleAdicionarAlimento,
    handleRemoverAlimento,
  }
}
