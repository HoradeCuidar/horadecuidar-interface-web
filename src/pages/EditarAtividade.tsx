import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BotaoVoltar, Skeleton } from '@/components'
import { FormularioExercicio } from '@/components/OrientacoesFuncionais'
import { orientacaoFuncionalService } from '@/services'
import type { OrientacaoFuncionalResponse } from '@/services/orientacaoFuncional.types'

export function EditarAtividade() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [valores, setValores] = useState<OrientacaoFuncionalResponse | null>(null)
  const [erro, setErro] = useState<string | null>(null)
  useEffect(() => {
    let ativo = true
    orientacaoFuncionalService.buscarPorId(Number(id))
      .then(dados => { if (ativo) setValores(dados) })
      .catch(error => { if (ativo) setErro(error instanceof Error ? error.message : 'Erro ao carregar orientação.') })
    return () => { ativo = false }
  }, [id])
  return <div className="space-y-5 p-4 sm:p-6 lg:flex lg:h-[calc(100dvh-4px)] lg:min-h-0 lg:flex-col lg:gap-5 lg:space-y-0 lg:overflow-hidden lg:p-8">
    <BotaoVoltar onClick={() => navigate('/atividades')}>Voltar</BotaoVoltar>
    {erro ? <p role="alert" className="text-sm text-red-600">{erro}</p> : valores ? <FormularioExercicio key={valores.id} titulo="Editar orientação funcional" valoresIniciais={valores} onCancelar={() => navigate('/atividades')} /> : <Skeleton className="h-96 rounded-2xl" />}
  </div>
}
