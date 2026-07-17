import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { FiCamera } from 'react-icons/fi'
import { Avatar } from '@/components'
import { authService, uploadService } from '@/services'
import { ModalRecortarFoto } from './ModalRecortarFoto'

type FotoPerfilUploadProps = {
  nome: string
  fotoUrl: string | null
  onFotoAtualizada: (url: string) => void
}

export function FotoPerfilUpload({
  nome,
  fotoUrl,
  onFotoAtualizada,
}: FotoPerfilUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [previewSrc, setPreviewSrc] = useState<string | null>(null)
  const [modalAberto, setModalAberto] = useState(false)
  const [enviando, setEnviando] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Selecione um arquivo de imagem.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('A imagem deve ter no máximo 5 MB.')
      return
    }

    const objectUrl = URL.createObjectURL(file)
    setPreviewSrc(objectUrl)
    setModalAberto(true)
  }

  function fecharModal() {
    setModalAberto(false)
    if (previewSrc) {
      URL.revokeObjectURL(previewSrc)
      setPreviewSrc(null)
    }
  }

  async function handleConfirmarCrop(file: File) {
    setEnviando(true)
    try {
      const url = await uploadService.uploadFotoPerfil(file)
      authService.updateUser({ fotoDePerfil: url })
      onFotoAtualizada(url)
      toast.success('Foto de perfil atualizada.')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao enviar foto.')
      throw err
    } finally {
      setEnviando(false)
    }
  }

  return (
    <>
      <div className="flex flex-col items-center gap-1.5">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={enviando}
          className="group relative rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          aria-label="Alterar foto de perfil"
          title="Alterar foto"
        >
          <Avatar name={nome} src={fotoUrl} className="size-24 text-xl sm:size-28" />
          <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/45 opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
            <FiCamera className="size-6 text-white" aria-hidden />
          </span>
          {enviando && (
            <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 text-xs font-medium text-white">
              Enviando...
            </span>
          )}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={handleChange}
        />
        <p className="max-w-[8rem] text-center text-[11px] leading-tight text-text-muted">
          Clique para alterar
        </p>
      </div>

      <ModalRecortarFoto
        aberto={modalAberto}
        imageSrc={previewSrc}
        onFechar={fecharModal}
        onConfirmar={handleConfirmarCrop}
      />
    </>
  )
}
