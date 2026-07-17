import { FotoPerfilUpload } from './FotoPerfilUpload'

type CabecalhoPerfilProps = {
  nome: string
  subtitulo: string
  badge?: string
  fotoUrl: string | null
  onFotoAtualizada: (url: string) => void
  acoes?: React.ReactNode
}

export function CabecalhoPerfil({
  nome,
  subtitulo,
  badge,
  fotoUrl,
  onFotoAtualizada,
  acoes,
}: CabecalhoPerfilProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <div className="flex min-w-0 flex-col items-center gap-3 sm:flex-row sm:items-center sm:gap-4">
        <FotoPerfilUpload
          nome={nome}
          fotoUrl={fotoUrl}
          onFotoAtualizada={onFotoAtualizada}
        />
        <div className="min-w-0 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            <h2 className="truncate text-lg font-semibold text-zinc-900 sm:text-xl">
              {nome}
            </h2>
            {badge && (
              <span className="inline-flex shrink-0 items-center rounded-full bg-[#EBF2FF] px-2.5 py-0.5 text-xs font-semibold text-[#5D99F4]">
                {badge}
              </span>
            )}
          </div>
          <p className="mt-0.5 truncate text-sm text-text-muted">{subtitulo}</p>
        </div>
      </div>
      {acoes && (
        <div className="flex shrink-0 flex-wrap items-center justify-center gap-2 sm:justify-end">
          {acoes}
        </div>
      )}
    </div>
  )
}
