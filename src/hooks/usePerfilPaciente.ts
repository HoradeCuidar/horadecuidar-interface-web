import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { pacienteService } from '@/services/paciente'
import type { PacienteDetalhes } from '@/services/paciente.mappers'

export function usePerfilPaciente(pacienteId: string | undefined) {
  const [paciente, setPaciente] = useState<PacienteDetalhes | null>(null)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    if (!pacienteId) {
      setPaciente(null)
      setErro('Paciente não encontrado.')
      setLoading(false)
      return
    }

    setLoading(true)
    setErro(null)

    pacienteService
      .buscarPorId(Number(pacienteId))
      .then(setPaciente)
      .catch((e) => {
        const msg = e instanceof Error ? e.message : 'Erro ao carregar paciente.'
        setErro(msg)
        toast.error(msg)
      })
      .finally(() => setLoading(false))
  }, [pacienteId])

  return { paciente, loading, erro }
}
