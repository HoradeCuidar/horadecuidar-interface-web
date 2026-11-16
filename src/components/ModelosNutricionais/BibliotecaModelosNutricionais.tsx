import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { FiCopy, FiPlus, FiSearch, FiTrash2 } from 'react-icons/fi'
import { SecaoRefeicao } from '@/components/PrescricaoNutricional/SecaoRefeicao'
import { focarPrimeiroErroNutricional } from '@/components/PrescricaoNutricional/focarPrimeiroErro'
import { criarFormularioVazio } from '@/components/PrescricaoNutricional/prescricaoNutricional.types'
import { usePrescricaoNutricionalForm } from '@/hooks/usePrescricaoNutricionalForm'
import { modeloNutricionalService, type ModeloNutricional, type ModeloNutricionalResumo } from '@/services/modeloNutricional'
import { formToPrescricaoNutricionalRequest, obterErrosPrescricaoNutricionalForm, responseToPrescricaoNutricionalForm } from '@/services/prescricaoNutricional.mappers'

type Props = { onPreparar: (modelo: ModeloNutricionalResumo) => void }

function modeloParaFormulario(modelo: ModeloNutricional) {
  return responseToPrescricaoNutricionalForm({
    id: modelo.id, pacienteId: 0, profissionalId: modelo.criadoPorId,
    dataInicio: '', dataFim: '', status: '', observacoes: '', refeicoes: modelo.refeicoes,
  }, '')
}

export function BibliotecaModelosNutricionais({ onPreparar }: Props) {
  const form = usePrescricaoNutricionalForm()
  const [modelos, setModelos] = useState<ModeloNutricionalResumo[]>([])
  const [selecionadoId, setSelecionadoId] = useState<number | null>(null)
  const [versao, setVersao] = useState<number | null>(null)
  const [nome, setNome] = useState('')
  const [referencia, setReferencia] = useState('')
  const [descricao, setDescricao] = useState('')
  const [busca, setBusca] = useState('')
  const [filtroKcal, setFiltroKcal] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [tentouSalvar, setTentouSalvar] = useState(false)
  const [erro, setErro] = useState('')
  const errosFormulario = tentouSalvar ? obterErrosPrescricaoNutricionalForm(form.form, false) : {}
  const nomeErro = tentouSalvar && !nome.trim() ? 'Informe o nome do modelo.' : ''
  const referenciaErro = tentouSalvar && referencia.trim() && (!Number.isInteger(Number(referencia)) || Number(referencia) <= 0)
    ? 'Informe uma referência calórica inteira e positiva.' : ''

  useEffect(() => {
    let ativo = true
    modeloNutricionalService.listar()
      .then((dados) => { if (ativo) setModelos(dados) })
      .catch((falha) => { if (ativo) setErro(falha instanceof Error ? falha.message : 'Erro ao carregar modelos.') })
      .finally(() => { if (ativo) setCarregando(false) })
    return () => { ativo = false }
  }, [])

  const referencias = useMemo(() => [...new Set(modelos.map((item) => item.referenciaKcal).filter((n): n is number => n !== null))].sort((a, b) => a - b), [modelos])
  const filtrados = useMemo(() => modelos.filter((item) =>
    item.nome.toLocaleLowerCase('pt-BR').includes(busca.toLocaleLowerCase('pt-BR')) &&
    (!filtroKcal || String(item.referenciaKcal) === filtroKcal)
  ), [modelos, busca, filtroKcal])

  async function atualizarLista() {
    setModelos(await modeloNutricionalService.listar())
  }

  function novo() {
    setTentouSalvar(false)
    setSelecionadoId(null)
    setVersao(null)
    setNome('')
    setReferencia('')
    setDescricao('')
    form.setFormCompleto(criarFormularioVazio())
  }

  async function selecionar(id: number) {
    try {
      const modelo = await modeloNutricionalService.buscar(id)
      setTentouSalvar(false)
      setSelecionadoId(id)
      setVersao(modelo.versao)
      setNome(modelo.nome)
      setReferencia(modelo.referenciaKcal === null ? '' : String(modelo.referenciaKcal))
      setDescricao(modelo.descricao ?? '')
      form.setFormCompleto(modeloParaFormulario(modelo))
    } catch (falha) {
      toast.error(falha instanceof Error ? falha.message : 'Erro ao abrir modelo.')
    }
  }

  async function salvar() {
    setTentouSalvar(true)
    const kcal = referencia.trim() ? Number(referencia) : null
    const erroFormulario = Object.values(obterErrosPrescricaoNutricionalForm(form.form, false))[0]
    const primeiraFalha = !nome.trim() ? 'Informe o nome do modelo.'
      : kcal !== null && (!Number.isInteger(kcal) || kcal <= 0) ? 'Informe uma referência calórica inteira e positiva.'
        : erroFormulario
    if (primeiraFalha) {
      toast.error(primeiraFalha)
      focarPrimeiroErroNutricional()
      return
    }
    const dados = {
      nome: nome.trim(), versao: versao ?? undefined, referenciaKcal: kcal, descricao: descricao.trim() || null,
      refeicoes: formToPrescricaoNutricionalRequest(0, form.form).refeicoes,
    }
    setSalvando(true)
    try {
      const salvo = selecionadoId === null
        ? await modeloNutricionalService.criar(dados)
        : await modeloNutricionalService.editar(selecionadoId, dados)
      await atualizarLista()
      await selecionar(salvo.id)
      toast.success('Modelo nutricional salvo.')
    } catch (falha) {
      toast.error(falha instanceof Error ? falha.message : 'Erro ao salvar modelo.')
    } finally { setSalvando(false) }
  }

  async function duplicar() {
    if (selecionadoId === null) return
    try {
      const copia = await modeloNutricionalService.duplicar(selecionadoId)
      await atualizarLista()
      await selecionar(copia.id)
      toast.success('Cópia criada. Edite o novo modelo quando necessário.')
    } catch (falha) {
      toast.error(falha instanceof Error ? falha.message : 'Erro ao duplicar modelo.')
    }
  }

  async function excluir() {
    if (selecionadoId === null || !window.confirm('Excluir este modelo da biblioteca? Prescrições já emitidas não serão alteradas.')) return
    try {
      await modeloNutricionalService.excluir(selecionadoId)
      await atualizarLista()
      novo()
      toast.success('Modelo excluído.')
    } catch (falha) {
      toast.error(falha instanceof Error ? falha.message : 'Erro ao excluir modelo.')
    }
  }

  return <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(18rem,0.75fr)_minmax(0,1.35fr)]">
    <section className="h-fit overflow-hidden rounded-2xl border border-surface-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-surface-100 p-5">
        <div><h2 className="font-heading text-lg font-bold text-text">Modelos disponíveis</h2><p className="mt-1 text-xs text-text-muted">Biblioteca compartilhada entre profissionais</p></div>
        <span className="rounded-full bg-brand-100 px-2.5 py-1 text-xs font-semibold text-brand-700">{modelos.length}</span>
      </div>
      <div className="space-y-3 border-b border-surface-100 p-4">
        <label className="relative block"><FiSearch className="absolute left-3 top-3 size-4 text-text-muted" aria-hidden /><span className="sr-only">Buscar modelos</span>
          <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar por nome" className="w-full rounded-xl border border-surface-100 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-brand-500" />
        </label>
        <label className="block"><span className="sr-only">Filtrar por referência calórica</span><select value={filtroKcal} onChange={(e) => setFiltroKcal(e.target.value)} className="w-full rounded-xl border border-surface-100 bg-white px-3 py-2.5 text-sm text-text">
          <option value="">Todas as referências calóricas</option>{referencias.map((kcal) => <option key={kcal} value={kcal}>{kcal} kcal</option>)}
        </select></label>
      </div>
      {erro ? <p role="alert" className="p-4 text-sm text-error-500">{erro}</p> : null}
      {carregando ? <p className="p-4 text-sm text-text-muted">Carregando modelos...</p> : filtrados.length === 0 ? <p className="p-4 text-sm text-text-muted">{modelos.length === 0 ? 'Nenhum modelo cadastrado. Crie o primeiro ao lado.' : 'Nenhum modelo corresponde à busca.'}</p> : (
        <div className="max-h-[42rem] divide-y divide-surface-100 overflow-y-auto">{filtrados.map((item) => <button key={item.id} type="button" onClick={() => void selecionar(item.id)}
          className={`w-full px-5 py-4 text-left transition hover:bg-brand-50 ${selecionadoId === item.id ? 'bg-brand-50' : ''}`}>
          <span className="flex items-start justify-between gap-2"><span className="font-semibold text-text">{item.nome}</span>{item.referenciaKcal ? <span className="shrink-0 rounded-full bg-brand-100 px-2 py-1 text-xs font-semibold text-brand-700">{item.referenciaKcal} kcal</span> : null}</span>
          <span className="mt-1 block text-xs text-text-muted">{item.quantidadeRefeicoes} {item.quantidadeRefeicoes === 1 ? 'refeição' : 'refeições'} · versão {item.versao}</span>
        </button>)}</div>
      )}
    </section>

    <section className="min-w-0 overflow-hidden rounded-2xl border border-surface-100 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-100 p-5">
        <div><h2 className="font-heading text-lg font-bold text-text">{selecionadoId === null ? 'Novo modelo' : 'Editar modelo'}</h2><p className="mt-1 text-xs text-text-muted">Ao salvar, o modelo fica disponível na biblioteca. Prescrições existentes permanecem independentes.</p></div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={novo} className="rounded-lg border border-surface-100 px-3 py-2 text-xs font-semibold text-text hover:bg-surface-0"><FiPlus className="mr-1 inline" aria-hidden /> Novo</button>
          {selecionadoId !== null ? <button type="button" onClick={() => void duplicar()} className="rounded-lg border border-surface-100 px-3 py-2 text-xs font-semibold text-text hover:bg-surface-0"><FiCopy className="mr-1 inline" aria-hidden /> Duplicar</button> : null}
        </div>
      </div>
      <div className="space-y-5 p-5">
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_10rem]">
          <label className="text-sm font-semibold text-text">Nome do modelo<input value={nome} onChange={(e) => setNome(e.target.value)} maxLength={160} aria-invalid={Boolean(nomeErro)} placeholder="Ex.: Plano alimentar de referência" className={`mt-1.5 w-full rounded-xl border px-3 py-2.5 font-normal outline-none focus:border-brand-500 ${nomeErro ? 'border-error-500' : 'border-surface-100'}`} />{nomeErro ? <span className="mt-1 block text-xs text-error-500">{nomeErro}</span> : null}</label>
          <label className="text-sm font-semibold text-text">Referência (kcal/dia)<input value={referencia} onChange={(e) => setReferencia(e.target.value)} type="number" min="1" step="1" aria-invalid={Boolean(referenciaErro)} placeholder="Opcional" className={`mt-1.5 w-full rounded-xl border px-3 py-2.5 font-normal outline-none focus:border-brand-500 ${referenciaErro ? 'border-error-500' : 'border-surface-100'}`} />{referenciaErro ? <span className="mt-1 block text-xs text-error-500">{referenciaErro}</span> : null}</label>
        </div>
        <label className="block text-sm font-semibold text-text">Descrição e orientação de uso<textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} rows={3} placeholder="Indicações para profissionais que usarão este modelo" className="mt-1.5 w-full rounded-xl border border-surface-100 px-3 py-2.5 font-normal outline-none focus:border-brand-500" /></label>
        <p className="text-xs text-text-muted">A referência em kcal é informada pelo profissional; o sistema não calcula calorias nem valida substituições.</p>
        <div className="border-t border-surface-100 pt-5"><div className="mb-4 flex items-center justify-between gap-2"><h3 className="font-heading text-base font-bold text-text">Refeições do modelo</h3><span className="text-xs text-text-muted">{form.form.refeicoes.length} {form.form.refeicoes.length === 1 ? 'refeição' : 'refeições'}</span></div>
          <div className="space-y-4">{form.form.refeicoes.map((refeicao, indice) => <SecaoRefeicao key={refeicao.id} refeicao={refeicao} indice={indice} podeRemover={form.form.refeicoes.length > 1}
            erros={errosFormulario}
            onChangeRefeicao={form.handleChangeRefeicao} onChangeOpcao={form.handleChangeOpcao} onChangeAlimento={form.handleChangeAlimento}
            onAdicionarOpcao={form.handleAdicionarOpcao} onRemoverOpcao={form.handleRemoverOpcao} onAdicionarAlimento={form.handleAdicionarAlimento}
            onRemoverAlimento={form.handleRemoverAlimento} onRemoverRefeicao={form.handleRemoverRefeicao} />)}</div>
          <button type="button" onClick={form.handleAdicionarRefeicao} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand-100 px-3 py-2 text-xs font-semibold text-brand-700 hover:bg-brand-50"><FiPlus aria-hidden /> Nova refeição</button>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-surface-100 pt-4">
          {selecionadoId !== null ? <button type="button" onClick={() => void excluir()} className="inline-flex items-center gap-1 text-xs font-semibold text-error-500"><FiTrash2 aria-hidden /> Excluir modelo</button> : <span />}
          <div className="flex flex-wrap gap-2">
            {selecionadoId !== null ? <button type="button" onClick={() => { const item = modelos.find((modelo) => modelo.id === selecionadoId); if (item) onPreparar(item) }} className="rounded-lg border border-brand-200 px-3 py-2 text-xs font-semibold text-brand-700 hover:bg-brand-50">Preparar prescrição com este modelo</button> : null}
            <button type="button" disabled={salvando} onClick={() => void salvar()} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60">{salvando ? 'Salvando...' : 'Salvar modelo'}</button>
          </div>
        </div>
      </div>
    </section>
  </div>
}
