import {
  FiActivity,
  FiCalendar,
  FiEdit2,
  FiFileText,
  FiMove,
  FiUser,
  FiZap,
} from 'react-icons/fi'
import type { AvaliacaoFisica } from '@/services/avaliacaoFisica.types'
import {
  formatarDataAvaliacao,
  formatarForcaKg,
  labelFlexibilidade,
  tituloAvaliacao,
} from './avaliacaoFisica.utils'

type CardAvaliacaoFisicaProps = {
  item: AvaliacaoFisica
  podeEditar: boolean
  maisRecente?: boolean
  onEditar: () => void
}

const focoBotao =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700'

function BlocoInfo({
  titulo,
  icone,
  children,
}: {
  titulo: string
  icone: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl bg-surface-0 px-3.5 py-3">
      <div className="mb-2 flex items-center gap-2">
        <span className="flex size-7 items-center justify-center rounded-lg bg-brand-100 text-brand-700">
          {icone}
        </span>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-text-muted">
          {titulo}
        </p>
      </div>
      <div className="text-sm text-text">{children}</div>
    </div>
  )
}

export function CardAvaliacaoFisica({
  item,
  podeEditar,
  maisRecente = false,
  onEditar,
}: CardAvaliacaoFisicaProps) {
  const nomeProf =
    item.profissional.nome?.trim() ||
    item.profissional.username?.trim() ||
    'Profissional'

  const titulo = tituloAvaliacao(item)
  const data = formatarDataAvaliacao(item.dataRegistro)

  const atividadeDetalhe = item.realizaAtividadeFisica
    ? [
        item.atividadeRealizada?.trim() || 'Atividade registrada',
        item.frequenciaSemanal != null
          ? `${item.frequenciaSemanal}x/semana`
          : null,
      ]
        .filter(Boolean)
        .join(' · ')
    : 'Não realiza atividade física regular'

  const forcaPalmarDir = formatarForcaKg(item.forcaPalmarDireita)
  const forcaPalmarEsq = formatarForcaKg(item.forcaPalmarEsquerda)
  const forcaJoelhoDir = formatarForcaKg(item.forcaJoelhoDireita)
  const forcaJoelhoEsq = formatarForcaKg(item.forcaJoelhoEsquerda)

  const notas = [
    item.queixas?.trim(),
    item.observacoesMusculoEsqueleticas?.trim(),
    item.orientacoesGerais?.trim(),
  ].filter(Boolean)

  const flexLabel = labelFlexibilidade(item.flexibilidade)
  const flexAtencao = item.flexibilidade === 'FRACA'

  return (
    <article className="rounded-2xl border border-surface-100 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
            <FiActivity className="size-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-heading text-base font-bold tracking-tight text-text sm:text-lg">
                {titulo}
              </h3>
              {maisRecente ? (
                <span className="rounded-full bg-surface-0 px-2.5 py-0.5 text-[11px] font-semibold text-text-muted">
                  Mais recente
                </span>
              ) : null}
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-muted">
              <span className="inline-flex items-center gap-1.5">
                <FiCalendar className="size-3.5 shrink-0" aria-hidden />
                {data}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <FiUser className="size-3.5 shrink-0" aria-hidden />
                por {nomeProf}
              </span>
            </div>
          </div>
        </div>

        {podeEditar ? (
          <button
            type="button"
            onClick={onEditar}
            className={`inline-flex items-center gap-1.5 rounded-lg border border-brand-200 px-3 py-1.5 text-sm font-medium text-brand-700 transition hover:bg-brand-50 ${focoBotao}`}
          >
            <FiEdit2 className="size-4" aria-hidden />
            Editar
          </button>
        ) : null}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <BlocoInfo
          titulo="Atividade física"
          icone={<FiActivity className="size-3.5" aria-hidden />}
        >
          <p className="font-medium">{atividadeDetalhe}</p>
          {item.indicacoesFuncionais.length > 0 ? (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {item.indicacoesFuncionais.map((tag) => (
                <span
                  key={tag.id}
                  className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-medium text-brand-700"
                >
                  {tag.nome}
                </span>
              ))}
            </div>
          ) : null}
        </BlocoInfo>

        <BlocoInfo
          titulo="Flexibilidade"
          icone={<FiMove className="size-3.5" aria-hidden />}
        >
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium">{flexLabel}</p>
            {flexAtencao ? (
              <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-semibold text-orange-700">
                Requer atenção
              </span>
            ) : null}
          </div>
        </BlocoInfo>

        <BlocoInfo
          titulo="Força muscular"
          icone={<FiZap className="size-3.5" aria-hidden />}
        >
          <ul className="space-y-1 font-medium">
            <li>
              Força palmar:{' '}
              {forcaPalmarDir || forcaPalmarEsq
                ? [forcaPalmarDir && `D ${forcaPalmarDir}`, forcaPalmarEsq && `E ${forcaPalmarEsq}`]
                    .filter(Boolean)
                    .join(' · ')
                : '—'}
            </li>
            <li>
              Força de joelho:{' '}
              {forcaJoelhoDir || forcaJoelhoEsq
                ? [forcaJoelhoDir && `D ${forcaJoelhoDir}`, forcaJoelhoEsq && `E ${forcaJoelhoEsq}`]
                    .filter(Boolean)
                    .join(' · ')
                : '—'}
            </li>
          </ul>
        </BlocoInfo>

        <BlocoInfo
          titulo="Notas e observações"
          icone={<FiFileText className="size-3.5" aria-hidden />}
        >
          {notas.length > 0 ? (
            <p className="line-clamp-4 leading-relaxed text-text-muted">
              {notas.join(' · ')}
            </p>
          ) : (
            <p className="text-text-muted">Sem observações registradas.</p>
          )}
        </BlocoInfo>
      </div>
    </article>
  )
}
