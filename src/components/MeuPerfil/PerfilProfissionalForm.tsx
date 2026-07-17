import { useState } from 'react'
import { toast } from 'sonner'
import { FiEdit2 } from 'react-icons/fi'
import {
  Input,
  Select,
  MaskedInput,
  BotaoSalvar,
  BotaoCancelar,
} from '@/components'
import { Button } from '@/components/ui/button'
import { opcoesGenero } from '@/constants/opcoesGenero'
import { authService, profissionalService } from '@/services'
import { CabecalhoPerfil } from './CabecalhoPerfil'
import { CampoDado } from './CampoDado'
import {
  formatarTelefoneExibicao,
  labelGenero,
  valorOuTraco,
  type MeuPerfilFormState,
} from './meuPerfil.helpers'

type PerfilProfissionalFormProps = {
  inicial: MeuPerfilFormState
  fotoUrl: string | null
  onFotoAtualizada: (url: string) => void
  onPerfilSalvo: (nome: string, foto?: string | null) => void
}

export function PerfilProfissionalForm({
  inicial,
  fotoUrl,
  onFotoAtualizada,
  onPerfilSalvo,
}: PerfilProfissionalFormProps) {
  const [form, setForm] = useState<MeuPerfilFormState>(inicial)
  const [editando, setEditando] = useState(false)
  const [salvando, setSalvando] = useState(false)

  function setCampo<K extends keyof MeuPerfilFormState>(
    key: K,
    value: MeuPerfilFormState[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function handleCancelar() {
    setForm(inicial)
    setEditando(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!editando) return
    setSalvando(true)
    try {
      const atualizado = await profissionalService.atualizarMeuPerfil({ ...form })
      authService.updateUser({
        nome: atualizado.nome,
        ...(atualizado.fotoDePerfil != null
          ? { fotoDePerfil: atualizado.fotoDePerfil }
          : {}),
      })
      onPerfilSalvo(atualizado.nome, atualizado.fotoDePerfil)
      setEditando(false)
      toast.success('Perfil atualizado com sucesso.')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao salvar perfil.')
    } finally {
      setSalvando(false)
    }
  }

  const endereco = [
    form.rua,
    form.numeroCasa && `nº ${form.numeroCasa}`,
    form.bairro,
    form.cidade,
    form.estado,
  ]
    .filter(Boolean)
    .join(', ')

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <CabecalhoPerfil
        nome={form.nome || form.username}
        subtitulo={form.email || `@${form.username}`}
        badge="Profissional"
        fotoUrl={fotoUrl}
        onFotoAtualizada={onFotoAtualizada}
        acoes={
          editando ? (
            <>
              <BotaoCancelar type="button" onClick={handleCancelar} disabled={salvando}>
                Cancelar
              </BotaoCancelar>
              <BotaoSalvar type="submit" disabled={salvando}>
                {salvando ? 'Salvando...' : 'Salvar'}
              </BotaoSalvar>
            </>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setEditando(true)}
            >
              <FiEdit2 aria-hidden />
              Editar
            </Button>
          )
        }
      />

      <div className="mt-4 border-t border-zinc-100 pt-3">
        {!editando ? (
          <dl className="grid gap-x-8 gap-y-1 sm:grid-cols-2">
            <CampoDado label="Telefone" valor={formatarTelefoneExibicao(form.telefone)} />
            <CampoDado label="Gênero" valor={labelGenero(form.genero)} />
            <CampoDado
              label="Data de nascimento"
              valor={valorOuTraco(form.dataNascimento)}
            />
            <CampoDado label="Username" valor={valorOuTraco(form.username)} />
            <CampoDado
              label="E-mail"
              valor={valorOuTraco(form.email)}
              className="sm:col-span-2"
            />
            <CampoDado
              label="Endereço"
              valor={valorOuTraco(endereco)}
              className="sm:col-span-2"
            />
          </dl>
        ) : (
          <div className="space-y-6 pt-4">
            <div>
              <h3 className="mb-3 text-sm font-semibold text-zinc-800">Dados pessoais</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  size="compact"
                  label="Nome"
                  placeholder="Insira o nome..."
                  value={form.nome}
                  onChange={(e) => setCampo('nome', e.target.value)}
                />
                <MaskedInput
                  size="compact"
                  label="Telefone"
                  mask="(00) 0 0000-0000"
                  value={form.telefone}
                  onAccept={(v) => setCampo('telefone', v ?? '')}
                  placeholder="(XX) X XXXX-XXXX"
                />
                <Select
                  size="compact"
                  label="Gênero"
                  options={[...opcoesGenero]}
                  value={form.genero}
                  onChange={(e) => setCampo('genero', e.target.value)}
                />
                <MaskedInput
                  size="compact"
                  label="Data de nascimento"
                  mask="00/00/0000"
                  value={form.dataNascimento}
                  onAccept={(v) => setCampo('dataNascimento', v ?? '')}
                  placeholder="dd/mm/yyyy"
                />
                <Input
                  size="compact"
                  label="E-mail"
                  type="email"
                  placeholder="Digite seu e-mail..."
                  value={form.email}
                  onChange={(e) => setCampo('email', e.target.value)}
                  className="sm:col-span-2"
                />
                <Input
                  size="compact"
                  label="Username"
                  value={form.username}
                  disabled
                  className="sm:col-span-2"
                />
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold text-zinc-800">Endereço</h3>
              <div className="grid gap-4 sm:grid-cols-3">
                <Input
                  size="compact"
                  label="Rua"
                  placeholder="Digite a rua..."
                  value={form.rua}
                  onChange={(e) => setCampo('rua', e.target.value)}
                  className="sm:col-span-2"
                />
                <Input
                  size="compact"
                  label="Nº da casa"
                  placeholder="XXXX"
                  value={form.numeroCasa}
                  onChange={(e) => setCampo('numeroCasa', e.target.value)}
                />
                <Input
                  size="compact"
                  label="Bairro"
                  placeholder="Digite o bairro..."
                  value={form.bairro}
                  onChange={(e) => setCampo('bairro', e.target.value)}
                />
                <Input
                  size="compact"
                  label="Estado"
                  placeholder="UF"
                  value={form.estado}
                  onChange={(e) =>
                    setCampo('estado', e.target.value.slice(0, 2).toUpperCase())
                  }
                  maxLength={2}
                />
                <Input
                  size="compact"
                  label="Cidade"
                  placeholder="Digite sua cidade..."
                  value={form.cidade}
                  onChange={(e) => setCampo('cidade', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </form>
  )
}
