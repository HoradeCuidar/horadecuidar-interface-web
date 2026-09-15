import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BotaoVoltar, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components'
import {
  EvolucaoSemanal,
  RelatorioAdesaoErro,
  RelatorioAdesaoSkeleton,
  ResumoMedicamentos,
  ResumoOrientacoes,
  SeletorPeriodo,
  TabelaDetalhamento,
  TabelaDetalhamentoOrientacoes,
} from '@/components/RelatorioAdesao'
import { PerfilPacienteSkeleton } from '@/components/PerfilPaciente/PerfilPacienteSkeleton'
import { usePerfilPaciente } from '@/hooks/usePerfilPaciente'
import { useRelatorioAdesaoMedicamento } from '@/hooks/useRelatorioAdesaoMedicamento'
import { useRelatorioOrientacaoFuncional } from '@/hooks/useRelatorioOrientacaoFuncional'
import {
  periodoPadraoUltimos14Dias,
  type PeriodoRelatorio,
} from '@/services'

type AbaRelatorio = 'medicamentos' | 'orientacoes'

export function RelatorioAdesao() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const pacienteId = id ? Number(id) : NaN
  const { paciente, loading: carregandoPaciente, erro: erroPaciente } =
    usePerfilPaciente(id)

  const [aba, setAba] = useState<AbaRelatorio>('medicamentos')
  const [periodoDraft, setPeriodoDraft] = useState<PeriodoRelatorio>(
    periodoPadraoUltimos14Dias
  )
  const [periodoAplicado, setPeriodoAplicado] = useState<PeriodoRelatorio>(
    periodoPadraoUltimos14Dias
  )

  const pacienteIdValido = Number.isFinite(pacienteId) ? pacienteId : null

  const med = useRelatorioAdesaoMedicamento({
    pacienteId: pacienteIdValido,
    periodo: periodoAplicado,
    enabled: aba === 'medicamentos',
  })

  const ori = useRelatorioOrientacaoFuncional({
    pacienteId: pacienteIdValido,
    periodo: periodoAplicado,
    enabled: aba === 'orientacoes',
  })

  const carregandoPeriodo =
    aba === 'medicamentos' ? med.carregando : ori.carregando

  function voltarPerfil() {
    navigate(`/pacientes/${id}`)
  }

  function aplicarPeriodo() {
    setPeriodoAplicado({ ...periodoDraft })
  }

  if (carregandoPaciente) {
    return <PerfilPacienteSkeleton />
  }

  if (erroPaciente || !paciente) {
    return (
      <div className="flex flex-col gap-4 px-8 pt-8">
        <BotaoVoltar onClick={() => navigate('/pacientes')}>Voltar</BotaoVoltar>
        <p className="text-sm text-red-600">
          {erroPaciente ?? 'Paciente não encontrado.'}
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5 px-4 pb-8 pt-5 sm:px-6 sm:pt-6 lg:px-8 lg:pt-8">
      <BotaoVoltar onClick={voltarPerfil}>Voltar</BotaoVoltar>

      <header>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-text">
          Relatório de adesão
        </h1>
        <p className="mt-1 text-sm text-text-muted">{paciente.nome}</p>
      </header>

      <SeletorPeriodo
        periodo={periodoDraft}
        onChange={setPeriodoDraft}
        onAplicar={aplicarPeriodo}
        carregando={carregandoPeriodo}
      />

      <Tabs
        value={aba}
        onValueChange={(value) => setAba(value as AbaRelatorio)}
        className="gap-5"
      >
        <TabsList>
          <TabsTrigger value="medicamentos">Medicamentos</TabsTrigger>
          <TabsTrigger value="orientacoes">Orientações</TabsTrigger>
        </TabsList>

        <TabsContent value="medicamentos">
          {med.carregando ? (
            <RelatorioAdesaoSkeleton />
          ) : med.erro || !med.resumo || !med.evolucao || !med.detalhamento ? (
            <RelatorioAdesaoErro
              mensagem={med.erro}
              onRetry={() => void med.recarregar()}
            />
          ) : (
            <div className="space-y-5">
              <ResumoMedicamentos dados={med.resumo} />
              <EvolucaoSemanal dados={med.evolucao} />
              <TabelaDetalhamento
                pagina={med.detalhamento}
                carregando={med.carregandoDetalhe}
                onPaginaAnterior={med.paginaAnterior}
                onPaginaProxima={med.paginaProxima}
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="orientacoes">
          {ori.carregando ? (
            <RelatorioAdesaoSkeleton />
          ) : ori.erro || !ori.resumo || !ori.detalhamento ? (
            <RelatorioAdesaoErro
              mensagem={ori.erro}
              onRetry={() => void ori.recarregar()}
            />
          ) : (
            <div className="space-y-5">
              <ResumoOrientacoes dados={ori.resumo} />
              <TabelaDetalhamentoOrientacoes
                pagina={ori.detalhamento}
                carregando={ori.carregandoDetalhe}
                onPaginaAnterior={ori.paginaAnterior}
                onPaginaProxima={ori.paginaProxima}
              />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
