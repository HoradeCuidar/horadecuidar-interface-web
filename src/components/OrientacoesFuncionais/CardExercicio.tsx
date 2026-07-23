import { useNavigate } from 'react-router-dom'
import { FiEdit2, FiTrash2, FiSlash, FiCheckCircle } from 'react-icons/fi'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { OrientacaoFuncionalResponse } from '@/services/orientacaoFuncional.types'
import { formatarData } from './orientacaoFuncional.utils'

type CardExercicioProps = {
  item: OrientacaoFuncionalResponse
  onAlterarStatus: (item: OrientacaoFuncionalResponse) => void
  onExcluir: (item: OrientacaoFuncionalResponse) => void
}

export function CardExercicio({
  item,
  onAlterarStatus,
  onExcluir,
}: CardExercicioProps) {
  const navigate = useNavigate()

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-brand-200 border-l-4 border-l-brand-500 bg-white shadow-card transition hover:shadow-md">
      {item.urlImagem && (
        <div className="h-36 w-full overflow-hidden bg-surface-100">
          <img
            src={item.urlImagem}
            alt=""
            className="size-full object-cover"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-heading text-sm font-bold tracking-tight text-text">
            {item.nome}
          </h3>
          <div className="flex shrink-0 items-center gap-0.5">
            <Badge
              className={`border-0 px-2.5 py-0.5 text-[11px] font-semibold text-white ${
                item.ativo ? 'bg-success-500' : 'bg-error-500'
              }`}
            >
              {item.ativo ? 'Ativa' : 'Inativa'}
            </Badge>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-brand-600 hover:bg-brand-100 hover:text-brand-700"
              title="Editar exercício"
              onClick={() => navigate(`/atividades/${item.id}/editar`)}
            >
              <FiEdit2 className="size-4" aria-hidden />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${
                item.ativo
                  ? 'text-error-500 hover:bg-error-500/15 hover:text-error-700'
                  : 'text-success-500 hover:bg-success-500/15 hover:text-success-700'
              }`}
              title={item.ativo ? 'Inativar exercício' : 'Ativar exercício'}
              onClick={() => onAlterarStatus(item)}
            >
              {item.ativo ? (
                <FiSlash className="size-4" aria-hidden />
              ) : (
                <FiCheckCircle className="size-4" aria-hidden />
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-error-500 hover:bg-error-500/15 hover:text-error-700"
              title="Excluir exercício"
              onClick={() => onExcluir(item)}
            >
              <FiTrash2 className="size-4" aria-hidden />
            </Button>
          </div>
        </div>

        {item.descricao && (
          <p className="line-clamp-3 text-xs text-text-muted">{item.descricao}</p>
        )}

        {item.finalidade && (
          <p className="line-clamp-2 text-xs text-text-muted">
            <span className="font-medium text-text">Finalidade: </span>
            {item.finalidade}
          </p>
        )}

        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {item.tags.map((tag) => (
              <span
                key={tag.id}
                title={tag.descricao ?? undefined}
                className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-medium text-brand-700"
              >
                {tag.nome}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto space-y-0.5 border-t border-zinc-100 pt-2">
          <p className="text-[11px] text-text-muted">{item.responsavel.nome}</p>
          <p className="text-[11px] text-text-muted">
            Cadastrado em {formatarData(item.dataCriacao)}
          </p>
        </div>
      </div>
    </article>
  )
}
