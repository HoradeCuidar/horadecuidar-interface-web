import { FiAtSign, FiMail } from 'react-icons/fi'
import { FotoPerfilUpload } from './FotoPerfilUpload'

type CabecalhoPerfilProps = {
  nome: string
  username?: string
  email?: string
  badge?: string
  statusLabel?: string | null
  idLabel?: string | null
  fotoUrl: string | null
  onFotoAtualizada: (url: string) => void
  acoes?: React.ReactNode
}

export function CabecalhoPerfil({
  nome,
  username,
  email,
  badge,
  statusLabel,
  idLabel,
  fotoUrl,
  onFotoAtualizada,
  acoes,
}: CabecalhoPerfilProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-surface-100 bg-white shadow-sm">
      <div className="relative h-28 bg-gradient-to-br from-brand-700 via-brand-600 to-brand-400 sm:h-32">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.45) 1px, transparent 0)',
            backgroundSize: '18px 18px',
          }}
          aria-hidden
        />
        {statusLabel ? (
          <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            <span className="size-1.5 rounded-full bg-success" aria-hidden />
            {statusLabel}
          </span>
        ) : null}
      </div>

      <div className="relative px-5 pb-5 sm:px-6 sm:pb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div className="flex min-w-0 flex-col items-center gap-3 sm:flex-row sm:items-start sm:gap-4">
            <div className="-mt-12 shrink-0 rounded-full bg-white p-1 shadow-sm sm:-mt-14">
              <FotoPerfilUpload
                nome={nome}
                fotoUrl={fotoUrl}
                onFotoAtualizada={onFotoAtualizada}
              />
            </div>
            <div className="min-w-0 flex-1 pt-1 text-center sm:pt-3 sm:text-left">
              <div className="flex min-w-0 flex-col items-center gap-2 sm:flex-row sm:items-center sm:justify-start">
                <h2 className="min-w-0 max-w-full truncate whitespace-nowrap font-heading text-lg font-bold text-text sm:text-xl">
                  {nome}
                </h2>
                {badge ? (
                  <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-brand-200 bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-700">
                    {badge}
                  </span>
                ) : null}
              </div>
              <div className="mt-1.5 flex flex-col items-center gap-1 text-sm text-text-muted sm:items-start">
                {username ? (
                  <p className="inline-flex max-w-full items-center gap-1.5 truncate">
                    <FiAtSign className="size-3.5 shrink-0" aria-hidden />
                    {username}
                  </p>
                ) : null}
                {email ? (
                  <p className="inline-flex max-w-full items-center gap-1.5 truncate">
                    <FiMail className="size-3.5 shrink-0" aria-hidden />
                    {email}
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          <div className="flex shrink-0 flex-col items-center gap-2 pt-1 sm:items-end sm:pt-3">
            {idLabel ? (
              <span className="rounded-full bg-surface-0 px-3 py-1 text-xs font-medium text-text-muted">
                {idLabel}
              </span>
            ) : null}
            {acoes ? (
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-end">
                {acoes}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
