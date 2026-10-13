import { useNavigate } from 'react-router-dom'
import { FiEdit2, FiSlash } from 'react-icons/fi'
import { Badge } from '@/components/ui/badge'
import { BotaoOrientacao as Button } from './BotaoOrientacao'
import { authService } from '@/services'
import type { OrientacaoFuncionalResponse } from '@/services/orientacaoFuncional.types'
import imagemPadrao from '@/assets/alongamento-default-funcional.png'

export function CardExercicio({ item, onAlterarStatus }: {
  item: OrientacaoFuncionalResponse; onAlterarStatus: (item: OrientacaoFuncionalResponse) => void
}) {
  const navigate = useNavigate()
  const profissional = ['ADMIN', 'PROFISSIONAL_DA_SAUDE'].includes(authService.getUser()?.role ?? '')
  const capa = item.midias.find(m => m.capa)
  const status = { RASCUNHO: 'Rascunho', PUBLICADA: 'Publicada', INATIVA: 'Inativa' }
  return <article className="flex flex-col overflow-hidden rounded-xl border border-brand-200 border-l-4 border-l-brand-500 bg-white shadow-card">
    <img src={capa?.url || imagemPadrao} alt={capa?.textoAlternativo || ''} className="h-50 w-full bg-surface-100 object-cover" />
    <div className="flex flex-1 flex-col gap-3 p-4">
      <div className="flex flex-wrap items-start justify-between gap-2"><h2 className="font-heading font-bold text-text">{item.nome}</h2>{profissional && <Badge variant="outline">{status[item.status]}</Badge>}</div>
      {item.categoria && <span className="w-fit rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-800">{item.categoria.nome}</span>}
      <p className="line-clamp-3 text-sm text-text-muted">{item.resumo || 'Resumo não preenchido.'}</p>
      <div className="flex flex-wrap gap-1">{item.tags.map(tag => <span key={tag.id} className="rounded-full bg-brand-100 px-2 py-1 text-xs text-brand-700">{tag.nome}</span>)}</div>
      <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-zinc-100 pt-3">
        <Button variant="outline" onClick={() => navigate(`/atividades/${item.id}`)}>Ver instruções e cuidados</Button>
        {profissional && <><Button variant="ghost" size="icon" title="Editar orientação" aria-label="Editar orientação" onClick={() => navigate(`/atividades/${item.id}/editar`)}><FiEdit2 /></Button>
          {item.status !== 'INATIVA' && <Button variant="ghost" size="icon" title="Inativar orientação" aria-label="Inativar orientação" onClick={() => onAlterarStatus(item)}><FiSlash className="text-red-500" /></Button>}</>}
      </div>
    </div>
  </article>
}
