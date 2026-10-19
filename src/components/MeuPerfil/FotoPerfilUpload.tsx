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
  usuarioId?: number
}

export function FotoPerfilUpload({
  nome,
  fotoUrl,
  onFotoAtualizada,
  usuarioId,
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
      const url = await uploadService.uploadFotoPerfil(file, usuarioId)
      if (usuarioId == null) authService.updateUser({ fotoDePerfil: url })
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
      <div className="relative">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={enviando}
          className="group relative rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
          aria-label="Alterar foto de perfil"
        >
          <Avatar
            name={nome}
            src={fotoUrl}
            className="size-24 text-xl sm:size-28"
          />
          <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
            <FiCamera className="size-6 text-white" aria-hidden />
          </span>
          {enviando ? (
            <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 text-xs font-medium text-white">
              Enviando...
            </span>
          ) : null}
        </button>
        <span
          className="pointer-events-none absolute bottom-0 right-0 flex size-8 items-center justify-center rounded-full border-2 border-white bg-brand-600 text-white shadow-sm"
          aria-hidden
        >
          <FiCamera className="size-3.5" />
        </span>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={handleChange}
        />
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
