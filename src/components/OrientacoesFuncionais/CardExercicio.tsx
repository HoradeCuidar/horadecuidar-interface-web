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
    <article className="flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-md">
      {item.urlImagem && (
        <div className="h-36 w-full overflow-hidden bg-zinc-100">
          <img
            src={item.urlImagem}
            alt=""
            className="size-full object-cover"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-zinc-800">{item.nome}</h3>
          <div className="flex shrink-0 items-center gap-0.5">
            <Badge
              className={`border-0 px-2.5 py-0.5 text-[11px] font-medium ${
                item.ativo
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-zinc-100 text-zinc-500'
              }`}
            >
              {item.ativo ? 'Ativa' : 'Inativa'}
            </Badge>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-zinc-400 hover:bg-blue-50 hover:text-blue-600"
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
                  ? 'text-zinc-400 hover:bg-amber-50 hover:text-amber-600'
                  : 'text-zinc-400 hover:bg-emerald-50 hover:text-emerald-600'
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
              className="h-8 w-8 text-zinc-400 hover:bg-red-50 hover:text-red-600"
              title="Excluir exercício"
              onClick={() => onExcluir(item)}
            >
              <FiTrash2 className="size-4" aria-hidden />
            </Button>
          </div>
        </div>

        {item.descricao && (
          <p className="line-clamp-3 text-xs text-zinc-600">{item.descricao}</p>
        )}

        {item.finalidade && (
          <p className="line-clamp-2 text-xs text-zinc-500">
            <span className="font-medium text-zinc-600">Finalidade: </span>
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
          <p className="text-[11px] text-zinc-400">{item.responsavel.nome}</p>
          <p className="text-[11px] text-zinc-400">
            Cadastrado em {formatarData(item.dataCriacao)}
          </p>
        </div>
      </div>
    </article>
  )
}
