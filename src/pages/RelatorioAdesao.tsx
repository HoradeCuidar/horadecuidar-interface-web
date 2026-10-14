import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { BiCapsule } from 'react-icons/bi'
import { FiActivity } from 'react-icons/fi'
import { MdRestaurant } from 'react-icons/md'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components'
import {
  CalendarioAdesaoPainel,
  CalendarioOrientacaoPainel,
} from '@/components/CalendarioSemana'
import {
  EvolucaoSemanal,
  RelatorioAdesaoErro,
  RelatorioAdesaoSkeleton,
  ResumoMedicamentos,
  ResumoNutricional,
  ResumoOrientacoes,
  SeletorPeriodo,
  TabelaDetalhamento,
  TabelaDetalhamentoOrientacoes,
} from '@/components/RelatorioAdesao'
import { PerfilPacienteSkeleton } from '@/components/PerfilPaciente/PerfilPacienteSkeleton'
import { calcularIdadeParticipante } from '@/components/PerfilPaciente/perfilPaciente.utils'
import { CORES_BADGE_DOENCA } from '@/components/PerfilPaciente/perfilPaciente.constants'
import { usePerfilPaciente } from '@/hooks/usePerfilPaciente'
import { useRelatorioAdesaoMedicamento } from '@/hooks/useRelatorioAdesaoMedicamento'
import { useRelatorioAdesaoNutricional } from '@/hooks/useRelatorioAdesaoNutricional'
import { useRelatorioOrientacaoFuncional } from '@/hooks/useRelatorioOrientacaoFuncional'
import {
  periodoPadraoUltimos14Dias,
  type PeriodoRelatorio,
} from '@/services'

type AbaRelatorio = 'medicamentos' | 'nutricional' | 'orientacoes'

const focoLink =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700'

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

  const nut = useRelatorioAdesaoNutricional({
    pacienteId: pacienteIdValido,
    periodo: periodoAplicado,
    enabled: aba === 'nutricional',
  })

  const carregandoPeriodo =
    aba === 'medicamentos'
      ? med.carregando
      : aba === 'nutricional'
        ? nut.carregando
        : ori.carregando

  function aplicarPeriodo(periodo?: PeriodoRelatorio) {
    const alvo = periodo ?? periodoDraft
    if (periodo) setPeriodoDraft(periodo)
    setPeriodoAplicado({ ...alvo })
  }

  if (carregandoPaciente) {
    return <PerfilPacienteSkeleton />
  }

  if (erroPaciente || !paciente) {
    return (
      <div className="flex flex-col gap-4 px-4 pt-6 sm:px-6 lg:px-8 lg:pt-8">
        <Link
          to="/pacientes"
          className={`text-sm font-medium text-brand-700 hover:text-brand-800 ${focoLink}`}
        >
          Voltar
        </Link>
        <p className="text-sm text-error-500" role="alert">
          {erroPaciente ?? 'Participante não encontrado.'}
        </p>
      </div>
    )
  }

  const idade = calcularIdadeParticipante(
    paciente.dataDeNascimento,
    paciente.idade
  )

  return (
    <div className="flex flex-col gap-5 px-4 pb-8 pt-5 sm:px-6 sm:pt-6 lg:px-8 lg:pt-8">
      <nav className="text-xs text-text-muted" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link
              to={`/pacientes/${id}`}
              className={`font-medium text-brand-700 transition hover:text-brand-800 ${focoLink}`}
            >
              Voltar ao perfil de {paciente.nome}
            </Link>
          </li>
        </ol>
      </nav>

      <header className="flex flex-col gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-text">
            Relatório de adesão
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            {paciente.nome}
            {idade != null ? ` · ${idade} anos` : ''}
          </p>
        </div>
        {paciente.doencas && paciente.doencas.length > 0 ? (
          <ul className="flex flex-wrap gap-2" aria-label="Condições">
            {paciente.doencas.slice(0, 4).map((doenca, index) => {
              const cor = CORES_BADGE_DOENCA[index % CORES_BADGE_DOENCA.length]
              return (
                <li
                  key={doenca.id}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${cor.badge}`}
                >
                  <span
                    className={`size-1.5 rounded-full ${cor.dot}`}
                    aria-hidden
                  />
                  {doenca.nome}
                </li>
              )
            })}
          </ul>
        ) : null}
      </header>

      <SeletorPeriodo
        periodo={periodoDraft}
        onChange={setPeriodoDraft}
        onAplicar={aplicarPeriodo}
        carregando={carregandoPeriodo}
        descricao={
          aba === 'nutricional'
            ? 'Selecione o intervalo para analisar a adesão às refeições prescritas.'
            : aba === 'orientacoes'
              ? 'Selecione o intervalo para analisar as orientações funcionais.'
              : 'Selecione o intervalo para analisar a adesão aos medicamentos.'
        }
      />

      <Tabs
        value={aba}
        onValueChange={(value) => setAba(value as AbaRelatorio)}
        className="gap-5"
      >
        <TabsList className="border-surface-100">
          <TabsTrigger
            value="medicamentos"
            className="inline-flex items-center gap-2"
          >
            <BiCapsule className="size-4" aria-hidden />
            Medicamentos
          </TabsTrigger>
          <TabsTrigger
            value="nutricional"
            className="inline-flex items-center gap-2"
          >
            <MdRestaurant className="size-4" aria-hidden />
            Nutricional
          </TabsTrigger>
          <TabsTrigger
            value="orientacoes"
            className="inline-flex items-center gap-2"
          >
            <FiActivity className="size-4" aria-hidden />
            Orientações
          </TabsTrigger>
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
              {pacienteIdValido != null ? (
                <CalendarioAdesaoPainel
                  pacienteId={pacienteIdValido}
                  dominio="medicamentos"
                />
              ) : null}
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

        <TabsContent value="nutricional">
          {nut.carregando ? (
            <RelatorioAdesaoSkeleton />
          ) : nut.erro || !nut.resumo || !nut.evolucao || !nut.detalhamento ? (
            <RelatorioAdesaoErro
              mensagem={nut.erro}
              onRetry={() => void nut.recarregar()}
            />
          ) : (
            <div className="space-y-5">
              {pacienteIdValido != null ? (
                <CalendarioAdesaoPainel
                  pacienteId={pacienteIdValido}
                  dominio="nutricional"
                />
              ) : null}
              <ResumoNutricional dados={nut.resumo} />
              <EvolucaoSemanal dados={nut.evolucao} dominio="nutricional" />
              <TabelaDetalhamento
                pagina={nut.detalhamento}
                dominio="nutricional"
                carregando={nut.carregandoDetalhe}
                onPaginaAnterior={nut.paginaAnterior}
                onPaginaProxima={nut.paginaProxima}
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
              {pacienteIdValido != null ? (
                <CalendarioOrientacaoPainel pacienteId={pacienteIdValido} />
              ) : null}
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
