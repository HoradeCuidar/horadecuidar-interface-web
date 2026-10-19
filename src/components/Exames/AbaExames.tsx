import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { FiArrowLeft, FiDownload, FiFileText, FiPlus, FiRefreshCw, FiUploadCloud } from 'react-icons/fi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { examesService, type DadosExame, type Exame, type StatusExame } from '@/services/exames'
import { IlustracaoExameVazio } from './IlustracaoExameVazio'
import pdfUploadIcon from '@/assets/exames/pdf-upload.svg'

const LIMITE_PDF = 5 * 1024 * 1024
const FUSO = 'America/Fortaleza'

type Visao = { tipo: 'lista' } | { tipo: 'formulario'; exame?: Exame } | { tipo: 'detalhe'; id: number }
type Filtro = 'TODOS' | 'RASCUNHO' | 'AGENDADO' | 'PUBLICADO'
type Acao = 'RASCUNHO' | 'PUBLICADO' | 'AGENDADO'

const estadoVisual: Record<StatusExame, { rotulo: string; classe: string }> = {
  RASCUNHO: { rotulo: 'Rascunho', classe: 'bg-[#fff3e0] text-[#b85d00]' },
  AGENDADO: { rotulo: 'Agendado', classe: 'bg-[#e8f0ff] text-[#3d5c99]' },
  PUBLICADO: { rotulo: 'Publicado', classe: 'bg-[#e8f7f1] text-[#28835e]' },
  INATIVADO: { rotulo: 'Inativado', classe: 'bg-zinc-100 text-zinc-600' },
}

function formatarData(data: string) {
  const [ano, mes, dia] = data.split('-')
  return `${dia}/${mes}/${ano}`
}

function formatarInstante(instante: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: FUSO, dateStyle: 'short', timeStyle: 'short',
  }).format(new Date(instante))
}

function erroMensagem(erro: unknown) {
  return erro instanceof Error ? erro.message : 'Não foi possível concluir a operação.'
}

function SeloStatus({ status }: { status: StatusExame }) {
  const visual = estadoVisual[status]
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${visual.classe}`}>{visual.rotulo}</span>
}

function nomeSeguro(nome: string | null) {
  return (nome || 'exame.pdf').replace(/[\\/]/g, '_')
}

export function AbaExames({ pacienteId, nomePaciente }: { pacienteId: number; nomePaciente: string }) {
  const [lista, setLista] = useState<Exame[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [visao, setVisao] = useState<Visao>({ tipo: 'lista' })
  const [filtro, setFiltro] = useState<Filtro>('TODOS')
  const [detalhe, setDetalhe] = useState<Exame | null>(null)
  const [carregandoDetalhe, setCarregandoDetalhe] = useState(false)
  const [baixandoId, setBaixandoId] = useState<number | null>(null)

  const carregar = useCallback(async (mostrarLoading = true) => {
    if (mostrarLoading) setLoading(true)
    setErro(null)
    try {
      setLista(await examesService.listar(pacienteId))
    } catch (e) {
      setErro(erroMensagem(e))
    } finally {
      if (mostrarLoading) setLoading(false)
    }
  }, [pacienteId])

  useEffect(() => { void carregar() }, [carregar])
  useEffect(() => {
    const id = window.setInterval(() => {
      if (document.visibilityState === 'visible' && visao.tipo === 'lista') void carregar(false)
    }, 60_000)
    return () => window.clearInterval(id)
  }, [carregar, visao.tipo])

  useEffect(() => {
    if (visao.tipo !== 'detalhe') return
    let ativo = true
    setCarregandoDetalhe(true)
    setDetalhe(null)
    examesService.detalhar(visao.id)
      .then((exame) => { if (ativo) setDetalhe(exame) })
      .catch((e) => { if (ativo) setErro(erroMensagem(e)) })
      .finally(() => { if (ativo) setCarregandoDetalhe(false) })
    return () => { ativo = false }
  }, [visao])

  async function baixar(exame: Exame) {
    setBaixandoId(exame.id)
    try {
      const arquivo = await examesService.baixar(exame.id)
      const url = URL.createObjectURL(arquivo)
      const link = document.createElement('a')
      link.href = url
      link.download = nomeSeguro(exame.nomeArquivo)
      document.body.append(link)
      link.click()
      link.remove()
      window.setTimeout(() => URL.revokeObjectURL(url), 60_000)
      toast.success('Download iniciado.')
    } catch (e) {
      toast.error(erroMensagem(e))
    } finally {
      setBaixandoId(null)
    }
  }

  function voltarLista() {
    setVisao({ tipo: 'lista' })
    setDetalhe(null)
    void carregar()
  }

  const visiveis = lista.filter((e) => e.status !== 'INATIVADO' && (filtro === 'TODOS' || e.status === filtro))

  if (visao.tipo === 'formulario') {
    return <FormularioExame pacienteId={pacienteId} nomePaciente={nomePaciente} exame={visao.exame}
      onVoltar={voltarLista} onSalvo={(exame) => { toast.success('Exame salvo.'); void carregar(false); setVisao({ tipo: 'detalhe', id: exame.id }) }} />
  }

  if (visao.tipo === 'detalhe') {
    return <section className="space-y-5">
      <button type="button" onClick={voltarLista} className="inline-flex items-center gap-2 text-sm font-medium text-[#3d5c99] hover:underline"><FiArrowLeft /> Voltar aos exames</button>
      {carregandoDetalhe && <p role="status" className="rounded-2xl bg-white p-8 text-sm text-[#6b7280]">Carregando exame...</p>}
      {!carregandoDetalhe && !detalhe && <p role="alert" className="rounded-2xl bg-white p-8 text-sm text-red-600">{erro ?? 'Exame não encontrado.'}</p>}
      {detalhe && <div className="rounded-2xl bg-white p-5 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3"><h2 className="text-xl font-bold text-[#1e2d3d]">Exame laboratorial • {formatarData(detalhe.dataColeta)}</h2><SeloStatus status={detalhe.status} /></div>
          <Button type="button" onClick={() => void baixar(detalhe)} disabled={baixandoId === detalhe.id} className="bg-[#6699ff] hover:bg-[#3d5c99]"><FiDownload /> {baixandoId === detalhe.id ? 'Baixando...' : 'Baixar PDF'}</Button>
        </div>
        <dl className="mt-5 grid gap-5 rounded-xl bg-[#f4f6fb] p-5 text-sm sm:grid-cols-2 lg:grid-cols-3">
          <div><dt className="text-xs text-[#6b7280]">Data da coleta</dt><dd className="font-medium">{formatarData(detalhe.dataColeta)}</dd></div>
          <div><dt className="text-xs text-[#6b7280]">Arquivo</dt><dd className="break-all font-medium">{detalhe.nomeArquivo ?? '—'}</dd></div>
          <div><dt className="text-xs text-[#6b7280]">Disponibilização</dt><dd className="font-medium">{detalhe.disponibilizacaoEm ? formatarInstante(detalhe.disponibilizacaoEm) : 'Não definida'}</dd></div>
          <div><dt className="text-xs text-[#6b7280]">Laboratório</dt><dd className="font-medium">{detalhe.laboratorio || 'Não informado'}</dd></div>
          <div><dt className="text-xs text-[#6b7280]">Tamanho do PDF</dt><dd className="font-medium">{detalhe.tamanhoBytes == null ? '—' : `${(detalhe.tamanhoBytes / 1024).toFixed(0)} KB`}</dd></div>
          <div><dt className="text-xs text-[#6b7280]">Estado</dt><dd className="font-medium">{estadoVisual[detalhe.status].rotulo}</dd></div>
        </dl>
        {detalhe.observacao && <div className="mt-5 rounded-xl border border-[#dce5f5] p-5"><h3 className="mb-2 font-semibold">Observações</h3><p className="whitespace-pre-wrap text-sm text-[#6b7280]">{detalhe.observacao}</p></div>}
        {(detalhe.status === 'RASCUNHO' || detalhe.status === 'AGENDADO') && <div className="mt-5 flex flex-wrap gap-3"><Button type="button" variant="outline" onClick={() => setVisao({ tipo: 'formulario', exame: detalhe })}>Corrigir exame</Button></div>}
        <p className="mt-5 text-xs text-[#6b7280]">Nesta etapa, os resultados estão disponíveis no PDF. Indicadores e gráficos serão adicionados depois.</p>
      </div>}
    </section>
  }

  return <section className="space-y-6">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div><h2 className="text-xl font-bold text-[#1e2d3d]">Exames laboratoriais</h2><p className="mt-1 text-sm text-[#6b7280]">Cadastre arquivos e controle quando o participante poderá visualizar cada exame.</p></div>
      <Button type="button" onClick={() => setVisao({ tipo: 'formulario' })} className="bg-[#3d5c99] hover:bg-[#2f4b80]"><FiPlus /> Novo exame</Button>
    </div>
    {loading ? <div role="status" className="rounded-2xl border border-[#dde3ee] bg-white p-10 text-center text-sm text-[#6b7280]">Carregando exames...</div>
      : erro ? <div role="alert" className="rounded-2xl border border-red-200 bg-white p-8 text-sm"><p className="text-red-600">{erro}</p><Button type="button" variant="outline" onClick={() => void carregar()} className="mt-4"><FiRefreshCw /> Tentar novamente</Button></div>
        : lista.length === 0 ? <div className="flex min-h-[482px] flex-col items-center justify-center gap-5 rounded-2xl border border-[#dde3ee] bg-white p-8 text-center">
          <IlustracaoExameVazio /><h3 className="text-[21px] font-bold text-[#1e2d3d]">Nenhum exame cadastrado</h3>
          <p className="max-w-[600px] text-sm text-[#6b7280]">Envie o arquivo em PDF e escolha quando o resultado ficará disponível para o participante.</p>
        </div> : <>
          <div className="flex flex-wrap items-center justify-between gap-3"><div className="flex flex-wrap gap-2">{(['TODOS', 'PUBLICADO', 'RASCUNHO', 'AGENDADO'] as const).map((item) => <button key={item} type="button" onClick={() => setFiltro(item)} aria-pressed={filtro === item} className={`rounded-full px-3 py-1 text-xs font-medium ${filtro === item ? 'bg-[#6699ff] text-white' : 'bg-white text-[#3d5c99]'}`}>{item === 'TODOS' ? 'Todos' : item === 'PUBLICADO' ? 'Publicados' : item === 'RASCUNHO' ? 'Rascunhos' : 'Agendados'}</button>)}</div><button type="button" onClick={() => void carregar()} aria-label="Atualizar exames" className="rounded-lg p-2 text-[#3d5c99] hover:bg-white"><FiRefreshCw /></button></div>
          <div className="space-y-3 rounded-2xl bg-white p-3 sm:p-5">{visiveis.length === 0 ? <p className="p-8 text-center text-sm text-[#6b7280]">Nenhum exame neste estado.</p> : visiveis.map((exame) => <article key={exame.id} className="flex flex-col gap-4 rounded-xl border border-[#dce5f5] p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-start gap-4"><div className="flex size-[52px] shrink-0 items-center justify-center rounded-full bg-[#e8f0ff] text-xs font-bold text-[#6699ff]">EX</div><div className="min-w-0 space-y-1"><div className="flex flex-wrap items-center gap-3"><h3 className="text-sm font-semibold text-[#1e2d3d]">{formatarData(exame.dataColeta)} • Exame laboratorial</h3><SeloStatus status={exame.status} /></div><p className="truncate text-xs text-[#6b7280]">{exame.laboratorio || exame.nomeArquivo || 'PDF do exame'}</p><p className="text-xs text-[#6b7280]">{exame.status === 'AGENDADO' && exame.disponibilizacaoEm ? `Disponível em ${formatarInstante(exame.disponibilizacaoEm)}` : exame.nomeArquivo}</p></div></div>
            <div className="flex flex-wrap gap-2 sm:shrink-0"><Button type="button" variant="outline" className="border-[#3d5c99] text-[#3d5c99]" onClick={() => setVisao({ tipo: 'detalhe', id: exame.id })}>Ver detalhes</Button><Button type="button" variant="outline" className="border-[#3d5c99] text-[#3d5c99]" onClick={() => void baixar(exame)} disabled={baixandoId === exame.id}><FiDownload /> {baixandoId === exame.id ? 'Baixando...' : 'Baixar PDF'}</Button></div>
          </article>)}</div>
        </>}
    <p className="text-xs text-[#6b7280]">Nesta etapa, os resultados são apresentados pelo arquivo. Indicadores e gráficos serão adicionados depois.</p>
  </section>
}

function FormularioExame({ pacienteId, nomePaciente, exame, onVoltar, onSalvo }: {
  pacienteId: number; nomePaciente: string; exame?: Exame; onVoltar: () => void; onSalvo: (exame: Exame) => void
}) {
  const [dados, setDados] = useState<DadosExame>({ dataColeta: exame?.dataColeta ?? '', laboratorio: exame?.laboratorio ?? '', observacao: exame?.observacao ?? '' })
  const [arquivo, setArquivo] = useState<File | null>(null)
  const [acao, setAcao] = useState<Acao>('RASCUNHO')
  const [agendamento, setAgendamento] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)
  const [rascunhoSalvo, setRascunhoSalvo] = useState<Exame | null>(exame ?? null)
  const inputArquivo = useRef<HTMLInputElement>(null)

  function selecionarArquivo(file?: File) {
    if (!file) return
    if (!file.name.toLowerCase().endsWith('.pdf') || file.type !== 'application/pdf') { setErro('Selecione um arquivo PDF válido.'); return }
    if (file.size === 0 || file.size > LIMITE_PDF) { setErro('O PDF deve ter até 5 MB.'); return }
    setErro(null)
    setArquivo(file)
  }

  async function salvar() {
    if (enviando) return
    if (!dados.dataColeta) { setErro('Informe a data da coleta.'); return }
    if (!arquivo && !rascunhoSalvo) { setErro('Selecione o PDF do exame.'); return }
    if (dados.laboratorio.length > 200) { setErro('O laboratório deve ter no máximo 200 caracteres.'); return }
    let horario: string | null = null
    if (acao === 'AGENDADO') {
      if (!agendamento) { setErro('Informe a data e hora da disponibilização.'); return }
      const instante = new Date(`${agendamento}:00-03:00`)
      if (Number.isNaN(instante.getTime()) || instante.getTime() <= Date.now()) { setErro('Escolha um horário futuro em Fortaleza.'); return }
      horario = instante.toISOString()
    }
    setEnviando(true)
    setErro(null)
    try {
      const base = rascunhoSalvo
        ? await examesService.corrigir(rascunhoSalvo.id, dados, arquivo ?? undefined)
        : await examesService.cadastrar(pacienteId, dados, arquivo!)
      setRascunhoSalvo(base)
      let final = base
      if (acao === 'PUBLICADO') final = await examesService.publicar(base.id)
      if (acao === 'AGENDADO' && horario) final = await examesService.agendar(base.id, horario)
      onSalvo(final)
    } catch (e) {
      setErro(erroMensagem(e))
      if (rascunhoSalvo) toast.error('Verifique o estado do exame antes de repetir a operação.')
    } finally {
      setEnviando(false)
    }
  }

  return <section className="space-y-6">
    <button type="button" onClick={onVoltar} className="inline-flex items-center gap-2 text-sm font-medium text-[#3d5c99] hover:underline"><FiArrowLeft /> Voltar aos exames</button>
    <div><h2 className="text-2xl font-bold text-[#1e2d3d]">{exame ? 'Corrigir exame' : 'Novo exame laboratorial'}</h2><p className="mt-1 text-sm text-[#6b7280]">Dados e arquivo do exame</p></div>
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="space-y-4 rounded-[14px] bg-white p-5 sm:p-6"><h3 className="text-lg font-semibold text-[#1e2d3d]">Dados do exame</h3>
        <label className="block text-xs text-[#6b7280]">Participante<Input value={nomePaciente} disabled className="mt-2 border-[#dce5f5] bg-white" /></label>
        <label className="block text-xs text-[#6b7280]">Data da coleta <span aria-hidden="true">*</span><Input type="date" value={dados.dataColeta} onChange={(e) => setDados({ ...dados, dataColeta: e.target.value })} className="mt-2 border-[#dce5f5] bg-white" required /></label>
        <label className="block text-xs text-[#6b7280]">Laboratório (opcional)<Input value={dados.laboratorio} maxLength={200} onChange={(e) => setDados({ ...dados, laboratorio: e.target.value })} className="mt-2 border-[#dce5f5] bg-white" /></label>
        <label className="block text-xs text-[#6b7280]">Observações (opcional)<textarea value={dados.observacao} onChange={(e) => setDados({ ...dados, observacao: e.target.value })} rows={3} className="mt-2 w-full rounded-lg border border-[#dce5f5] bg-white p-3 text-sm text-[#1e2d3d] focus:outline-[#6699ff]" /></label>
      </div>
      <div className="space-y-4 rounded-[14px] bg-white p-5 sm:p-6"><h3 className="text-lg font-semibold text-[#1e2d3d]">Arquivo do exame</h3>
        <input ref={inputArquivo} type="file" accept="application/pdf,.pdf" className="sr-only" onChange={(e) => selecionarArquivo(e.target.files?.[0])} aria-label="Selecionar PDF do exame" />
        <button type="button" onClick={() => inputArquivo.current?.click()} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); selecionarArquivo(e.dataTransfer.files[0]) }} className="flex min-h-[172px] w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#e8f0ff] px-4 text-center hover:bg-[#f4f6fb]">
          <img src={pdfUploadIcon} alt="" className="h-[62px] w-[62px]" /><span className="text-sm font-medium text-[#1e2d3d]">Arraste o PDF aqui ou selecione um arquivo</span><span className="text-xs text-[#6b7280]">Somente PDF • até 5 MB</span>
        </button>
        {(arquivo || rascunhoSalvo?.nomeArquivo) && <div className="flex items-center gap-3 rounded-lg bg-[#f4f6fb] p-4 text-sm"><FiFileText className="shrink-0 text-[#e85356]" /><span className="min-w-0 truncate">{arquivo?.name ?? rascunhoSalvo?.nomeArquivo}</span></div>}
        <p className="rounded-lg bg-[#e8f0ff] p-3 text-xs text-[#3d5c99]">O PDF é o documento original. O participante só poderá acessá-lo após a disponibilização.</p>
      </div>
    </div>
    <div className="rounded-[14px] bg-white p-5 sm:p-6">
      <h3 className="mb-4 text-lg font-semibold text-[#1e2d3d]">Disponibilização</h3>
      <div className="grid gap-3 sm:grid-cols-3">{([['RASCUNHO', exame ? 'Manter estado atual' : 'Salvar rascunho'], ['PUBLICADO', 'Disponibilizar agora'], ['AGENDADO', 'Agendar disponibilização']] as const)
        .map(([valor, rotulo]) =>
          <label key={valor} className={`flex cursor-pointer items-center gap-2 rounded-lg border p-3 text-sm ${acao === valor ? 'border-[#6699ff] bg-[#e8f0ff] text-[#3d5c99]' : 'border-[#dce5f5]'}`}>
            <input type="radio" name="acao-exame" checked={acao === valor} onChange={() => setAcao(valor)} />{rotulo}
          </label>)}
      </div>
      {acao === 'AGENDADO' && <label className="mt-4 block max-w-sm text-xs text-[#6b7280]">Data e hora em Fortaleza<Input type="datetime-local" value={agendamento} onChange={(e) => setAgendamento(e.target.value)} className="mt-2 border-[#dce5f5] bg-white" /></label>}
    </div>
    {rascunhoSalvo && <p role="status" className="rounded-lg bg-[#e8f0ff] p-3 text-sm text-[#3d5c99]">Exame #{rascunhoSalvo.id} salvo no servidor. Você pode continuar a disponibilização sem reenviar o PDF.</p>}
    {erro && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{erro}</p>}
    <div className="flex flex-wrap justify-end gap-3"><Button type="button" variant="outline" onClick={onVoltar} disabled={enviando}>Cancelar</Button><Button type="button" onClick={() => void salvar()} disabled={enviando} className="bg-[#6699ff] hover:bg-[#3d5c99]"><FiUploadCloud /> {enviando ? 'Salvando...' : acao === 'RASCUNHO' ? exame ? 'Salvar alterações' : 'Salvar rascunho' : acao === 'PUBLICADO' ? 'Disponibilizar agora' : 'Agendar disponibilização'}</Button></div>
  </section>
}
