import { useCallback, useEffect, useState } from 'react'
import { authService, profissionalService } from '@/services'
import { PerfilAdmin } from '@/components/MeuPerfil/PerfilAdmin'
import { PerfilProfissionalForm } from '@/components/MeuPerfil/PerfilProfissionalForm'
import {
  mapProfissionalToForm,
  type MeuPerfilFormState,
} from '@/components/MeuPerfil/meuPerfil.helpers'

export function MeuPerfil() {
  const user = authService.getUser()
  const userId = user?.id
  const role = user?.role
  const username = user?.username ?? ''

  const [fotoUrl, setFotoUrl] = useState<string | null>(user?.fotoDePerfil ?? null)
  const [formInicial, setFormInicial] = useState<MeuPerfilFormState | null>(null)
  const [loading, setLoading] = useState(role === 'PROFISSIONAL_DA_SAUDE')
  const [erro, setErro] = useState<string | null>(null)

  const carregarProfissional = useCallback(async () => {
    if (role !== 'PROFISSIONAL_DA_SAUDE' || userId == null) return
    setLoading(true)
    setErro(null)
    try {
      const dados = await profissionalService.buscarPorId(userId)
      setFormInicial(mapProfissionalToForm(dados))
      const foto = dados.fotoDePerfil ?? null
      setFotoUrl(foto)
      authService.updateUser({
        nome: dados.nome,
        fotoDePerfil: foto,
      })
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro ao carregar perfil.')
      setFormInicial(null)
    } finally {
      setLoading(false)
    }
  }, [role, userId])

  useEffect(() => {
    void carregarProfissional()
  }, [carregarProfissional])

  if (!user || userId == null || !role) {
    return (
      <div className="p-6 sm:p-8">
        <p className="text-sm text-red-600">Faça login para ver seu perfil.</p>
      </div>
    )
  }

  return (
    <div className="w-full p-6 sm:p-8">
      <header className="mb-5">
        <h1 className="font-heading text-2xl font-semibold text-text">Meu perfil</h1>
        <p className="mt-1 text-sm text-text-muted">
          Visualize e atualize suas informações.
        </p>
      </header>

      {role === 'ADMIN' && (
        <PerfilAdmin
          userId={userId}
          username={username}
          role={role}
          fotoUrl={fotoUrl}
          onFotoAtualizada={setFotoUrl}
        />
      )}

      {role === 'PROFISSIONAL_DA_SAUDE' && (
        <>
          {loading && (
            <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-10 text-center text-sm text-text-muted">
              Carregando perfil...
            </div>
          )}
          {erro && !loading && (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-4 py-10">
              <p className="text-center text-sm text-red-600">{erro}</p>
              <button
                type="button"
                onClick={() => void carregarProfissional()}
                className="text-sm font-medium text-brand-500 hover:text-brand-600"
              >
                Tentar novamente
              </button>
            </div>
          )}
          {!loading && !erro && formInicial && (
            <PerfilProfissionalForm
              key={`${formInicial.email}-${formInicial.telefone}-${formInicial.nome}`}
              inicial={formInicial}
              fotoUrl={fotoUrl}
              onFotoAtualizada={setFotoUrl}
              onPerfilSalvo={(nome, foto) => {
                setFormInicial((prev) => (prev ? { ...prev, nome } : prev))
                if (foto != null) setFotoUrl(foto)
              }}
            />
          )}
        </>
      )}

      {role === 'PACIENTE' && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 text-sm text-text-muted shadow-sm">
          O perfil do participante não está disponível neste módulo web.
        </div>
      )}
    </div>
  )
}
