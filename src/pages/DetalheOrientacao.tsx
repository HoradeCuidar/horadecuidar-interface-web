import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { BotaoVoltar, Input, Skeleton } from '@/components'
import { BotaoOrientacao as Button } from '@/components/OrientacoesFuncionais/BotaoOrientacao'
import { ConteudoOrientacao } from '@/components/OrientacoesFuncionais/ConteudoOrientacao'
import { orientacaoFuncionalService, authService } from '@/services'
import { realizacaoFuncionalService } from '@/services/realizacaoFuncional'
import type { OrientacaoFuncionalResponse } from '@/services/orientacaoFuncional.types'
import type { StatusRealizacao, SensacaoFinal } from '@/services/realizacaoFuncional.types'

export function DetalheOrientacao() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [dados, setDados] = useState<OrientacaoFuncionalResponse | null>(null)
  const [erro, setErro] = useState<string | null>(null)
  const [registrando, setRegistrando] = useState(false)
  const [abrirRegistro, setAbrirRegistro] = useState(false)
  const [status, setStatus] = useState<StatusRealizacao>('REALIZADO')
  const [duracao, setDuracao] = useState('')
  const [sensacao, setSensacao] = useState<SensacaoFinal | ''>('')
  const [observacao, setObservacao] = useState('')
  const usuario = authService.getUser()
  useEffect(() => {
    let ativo = true
    orientacaoFuncionalService.buscarPorId(Number(id)).then(d => { if (ativo) setDados(d) }).catch(e => { if (ativo) setErro(e instanceof Error ? e.message : 'Erro ao carregar orientação.') })
    return () => { ativo = false }
  }, [id])
  async function registrar(e: React.FormEvent) {
    e.preventDefault()
    if (!usuario || !dados) return
    setRegistrando(true)
    try {
      await realizacaoFuncionalService.registrar(usuario.id, { id: dados.id, status, duracaoRealizadaMinutos: duracao ? Number(duracao) : null, sensacaoFinal: sensacao || null, observacao: observacao.trim() || null })
      toast.success('Realização registrada.'); setAbrirRegistro(false); setDuracao(''); setObservacao(''); setSensacao('')
    } catch (error) { toast.error(error instanceof Error ? error.message : 'Erro ao registrar realização.') }
    finally { setRegistrando(false) }
  }
  return <div className="mx-auto w-full max-w-4xl space-y-5 p-4 sm:p-6 lg:p-8">
    <BotaoVoltar onClick={() => navigate('/atividades')}>Voltar</BotaoVoltar>
    {erro ? <p role="alert" className="text-red-600">{erro}</p> : !dados ? <Skeleton className="h-96 rounded-2xl" /> : <div className="space-y-6 rounded-2xl bg-white p-5 shadow-sm sm:p-8">
      {dados.status !== 'PUBLICADA' && <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-800">Prévia interna: esta orientação não está publicada.</p>}
      <ConteudoOrientacao dados={dados} />
      <p className="text-sm text-text-muted">Conteúdo geral do catálogo. A orientação não substitui a avaliação individual pela equipe de saúde.</p>
      {usuario?.role === 'PACIENTE' && dados.status === 'PUBLICADA' && <section className="border-t border-zinc-200 pt-5">
        <h2 className="font-heading text-lg font-semibold text-text">Registrar uma realização voluntária</h2><p className="my-2 text-sm text-text-muted">Informe uma atividade que você realizou. Este registro não gera pendências nem percentual de adesão.</p>
        {!abrirRegistro ? <Button onClick={() => setAbrirRegistro(true)}>Registrar realização</Button> : <form onSubmit={registrar} className="mt-4 space-y-4"><fieldset disabled={registrando} className="space-y-4">
          <label className="block text-sm text-text">Realização<select value={status} onChange={e => setStatus(e.target.value as StatusRealizacao)} className="ml-2 rounded-lg border border-zinc-200 p-2"><option value="REALIZADO">Realizada</option><option value="PARCIALMENTE_REALIZADO">Parcialmente realizada</option></select></label>
          <Input label="Duração em minutos (opcional)" type="number" size="compact" min={1} max={1440} value={duracao} onChange={e => setDuracao(e.target.value)} />
          <label className="block text-sm text-text">Como você se sentiu?<select value={sensacao} onChange={e => setSensacao(e.target.value as SensacaoFinal | '')} className="ml-2 rounded-lg border border-zinc-200 p-2"><option value="">Não informar</option><option value="ME_SUPEREI">Me superei</option><option value="BEM_FORTE">Bem forte</option><option value="DE_BOA">De boa</option><option value="ARRASTADO">Arrastado</option><option value="QUASE_NAO_DEU">Quase não deu</option></select></label>
          <label className="block text-sm text-text">Observação (opcional)<textarea value={observacao} maxLength={5000} onChange={e => setObservacao(e.target.value)} className="mt-2 block w-full rounded-lg border border-zinc-200 p-3" /></label>
          <div className="flex gap-3"><Button type="button" variant="outline" onClick={() => setAbrirRegistro(false)}>Cancelar</Button><Button type="submit">{registrando ? 'Registrando...' : 'Confirmar realização'}</Button></div>
        </fieldset></form>}
      </section>}
    </div>}
  </div>
}
