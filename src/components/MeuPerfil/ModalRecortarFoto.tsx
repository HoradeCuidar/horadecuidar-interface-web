import { useCallback, useState } from 'react'
import Cropper, { type Area } from 'react-easy-crop'
import { Modal } from '@/components'
import { Button } from '@/components/ui/button'
import { getCroppedImg } from './cropImage'

type ModalRecortarFotoProps = {
  aberto: boolean
  imageSrc: string | null
  onFechar: () => void
  onConfirmar: (file: File) => void | Promise<void>
}

export function ModalRecortarFoto({
  aberto,
  imageSrc,
  onFechar,
  onConfirmar,
}: ModalRecortarFotoProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [processando, setProcessando] = useState(false)

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels)
  }, [])

  async function handleConfirmar() {
    if (!imageSrc || !croppedAreaPixels) return
    setProcessando(true)
    try {
      const file = await getCroppedImg(imageSrc, croppedAreaPixels)
      await onConfirmar(file)
      onFechar()
    } finally {
      setProcessando(false)
    }
  }

  function handleFechar() {
    if (processando) return
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setCroppedAreaPixels(null)
    onFechar()
  }

  return (
    <Modal
      aberto={aberto && Boolean(imageSrc)}
      onFechar={handleFechar}
      titulo="Ajustar foto"
      subtitulo="Arraste e use o zoom para enquadrar"
      largura="sm"
      showCloseButton
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={handleFechar}
            disabled={processando}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={() => void handleConfirmar()}
            disabled={processando || !croppedAreaPixels}
          >
            {processando ? 'Processando...' : 'Confirmar'}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="relative h-72 w-full overflow-hidden rounded-xl bg-zinc-900">
          {imageSrc && (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          )}
        </div>
        <label className="flex flex-col gap-2 text-sm text-text">
          <span className="font-medium">Zoom</span>
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full accent-brand-500"
          />
        </label>
      </div>
    </Modal>
  )
}
