import { useState } from 'react'
import { toast } from 'sonner'
import {
  FiCheckCircle,
  FiEdit2,
  FiMapPin,
  FiUser,
} from 'react-icons/fi'
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
import { SecaoPerfil } from './SecaoPerfil'
import {
  formatarTelefoneExibicao,
  labelGenero,
  labelStatusSistema,
  montarEndereco,
  valorOuTraco,
  type MeuPerfilFormState,
} from './meuPerfil.helpers'

type PerfilProfissionalFormProps = {
  inicial: MeuPerfilFormState
  fotoUrl: string | null
  onFotoAtualizada: (url: string) => void
  onPerfilSalvo: (nome: string, foto?: string | null) => void
}

const focoBotao =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700'

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
      const atualizado = await profissionalService.atualizarMeuPerfil({
        nome: form.nome,
        genero: form.genero,
        telefone: form.telefone,
        dataNascimento: form.dataNascimento,
        email: form.email,
        rua: form.rua,
        numeroCasa: form.numeroCasa,
        bairro: form.bairro,
        estado: form.estado,
        cidade: form.cidade,
        username: form.username,
      })
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

  const endereco = montarEndereco(form)
  const cidadeEstado = [form.cidade, form.estado].filter(Boolean).join(' - ')
  const mapaUrl = endereco
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(endereco)}`
    : null

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <CabecalhoPerfil
        nome={form.nome || form.username}
        username={form.username}
        email={form.email}
        badge="Profissional de Saúde"
        statusLabel={labelStatusSistema(form.status)}
        idLabel={`ID: #${form.id}`}
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
              size="sm"
              onClick={() => setEditando(true)}
              className={`bg-brand-600 text-text-inverse hover:bg-brand-700 ${focoBotao}`}
            >
              <FiEdit2 aria-hidden />
              Editar perfil
            </Button>
          )
        }
      />

      {!editando ? (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="space-y-5">
            <SecaoPerfil
              titulo="Dados pessoais e contato"
              subtitulo="Informações de cadastro e comunicação"
              icone={<FiUser className="size-5" aria-hidden />}
              badge={
                form.email ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-1 text-[11px] font-semibold text-success-700">
                    <FiCheckCircle className="size-3.5" aria-hidden />
                    Confirmado
                  </span>
                ) : null
              }
            >
              <dl className="grid gap-3 sm:grid-cols-2">
                <CampoDado
                  label="Telefone"
                  valor={formatarTelefoneExibicao(form.telefone)}
                  dica="Contato principal"
                />
                <CampoDado
                  label="Gênero"
                  valor={labelGenero(form.genero)}
                  dica="Identificação de cadastro"
                />
                <CampoDado
                  label="Data de nascimento"
                  valor={valorOuTraco(form.dataNascimento)}
                  dica="Registro civil"
                />
                <CampoDado
                  label="Nome de usuário"
                  valor={valorOuTraco(form.username)}
                  dica="Identificador único de login"
                />
                <CampoDado
                  label="E-mail"
                  valor={valorOuTraco(form.email)}
                  dica="Canal institucional de acesso"
                  className="sm:col-span-2"
                  destaque={Boolean(form.email)}
                />
              </dl>
            </SecaoPerfil>

            <SecaoPerfil
              titulo="Localização e endereço"
              subtitulo="Endereço vinculado ao cadastro profissional"
              icone={<FiMapPin className="size-5" aria-hidden />}
              badge={
                cidadeEstado ? (
                  <span className="rounded-full bg-brand-100 px-2.5 py-1 text-[11px] font-semibold text-brand-700">
                    {cidadeEstado}
                  </span>
                ) : null
              }
            >
              <div className="flex flex-col gap-3 rounded-xl bg-surface-0 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-start gap-3">
                  <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-700">
                    <FiMapPin className="size-4" aria-hidden />
                  </span>
                  <p className="text-sm font-medium break-words text-text">
                    {valorOuTraco(endereco)}
                  </p>
                </div>
                {mapaUrl ? (
                  <a
                    href={mapaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`shrink-0 rounded-lg border border-brand-700 px-3 py-2 text-center text-xs font-semibold text-brand-700 transition hover:bg-brand-50 ${focoBotao}`}
                  >
                    Ver no mapa
                  </a>
                ) : null}
              </div>
            </SecaoPerfil>
          </div>

          <SecaoPerfil
            titulo="Acesso"
            subtitulo="Credenciais visíveis neste módulo"
            className="h-fit"
          >
            <dl className="space-y-3">
              <CampoDado
                label="Perfil"
                valor="Profissional de Saúde"
                dica="Permissões do módulo web"
              />
              <CampoDado
                label="Status"
                valor={valorOuTraco(form.status)}
                dica="Situação atual da conta"
              />
              <CampoDado
                label="Identificador"
                valor={`#${form.id}`}
                dica="ID interno do sistema"
              />
            </dl>
          </SecaoPerfil>
        </div>
      ) : (
        <div className="space-y-5 rounded-2xl border border-surface-100 bg-white p-5 shadow-sm sm:p-6">
          <div>
            <h3 className="mb-3 text-sm font-semibold text-text">Dados pessoais</h3>
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
            <h3 className="mb-3 text-sm font-semibold text-text">Endereço</h3>
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
    </form>
  )
}
