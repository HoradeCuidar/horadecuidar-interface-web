import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { pacienteService } from '@/services/paciente'
import type { PacienteDetalhes } from '@/services/paciente.mappers'

export function usePerfilPaciente(pacienteId: string | undefined) {
  const [paciente, setPaciente] = useState<PacienteDetalhes | null>(null)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  const carregar = useCallback(async () => {
    if (!pacienteId) {
      setPaciente(null)
      setErro('Participante não encontrado.')
      setLoading(false)
      return
    }

    setLoading(true)
    setErro(null)

    try {
      const dados = await pacienteService.buscarPorId(Number(pacienteId))
      setPaciente(dados)
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : 'Erro ao carregar participante.'
      setErro(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }, [pacienteId])

  useEffect(() => {
    void carregar()
  }, [carregar])

  return { paciente, loading, erro, recarregar: carregar }
}
