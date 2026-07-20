import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { FiUpload, FiX } from 'react-icons/fi'
import { BotaoVoltar, Input, BotaoSalvar, BotaoCancelar } from '@/components'
import { SeletorTags } from '@/components/OrientacoesFuncionais'
import { orientacaoFuncionalService, tagFuncionalService } from '@/services'
import type {
  OrientacaoFuncionalRequest,
  TagFuncional,
} from '@/services/orientacaoFuncional.types'

const MAX_IMAGE_BYTES = 5 * 1024 * 1024

export function CadastroAtividade() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [salvando, setSalvando] = useState(false)

  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [finalidade, setFinalidade] = useState('')
  const [tagsSelecionadas, setTagsSelecionadas] = useState<number[]>([])
  const [tagsDisponiveis, setTagsDisponiveis] = useState<TagFuncional[]>([])
  const [tagsLoading, setTagsLoading] = useState(true)
  const [tagsErro, setTagsErro] = useState<string | null>(null)
  const [imagem, setImagem] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    async function carregarTags() {
      setTagsLoading(true)
      setTagsErro(null)
      try {
        setTagsDisponiveis(await tagFuncionalService.listar())
      } catch (err) {
        setTagsErro(
          err instanceof Error
            ? err.message
            : 'Erro ao carregar tags funcionais.'
        )
      } finally {
        setTagsLoading(false)
      }
    }
    void carregarTags()
  }, [])

  function handleImagemSelecionada(file: File | undefined) {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('Selecione um arquivo de imagem.')
      return
    }
    if (file.size > MAX_IMAGE_BYTES) {
      toast.error('A imagem deve ter no máximo 5 MB.')
      return
    }
    setImagem(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  function removerImagem() {
    setImagem(null)
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const nomeTrimmed = nome.trim()
    if (!nomeTrimmed) {
      toast.error('Informe o nome do exercício.')
      return
    }
    if (nomeTrimmed.length > 100) {
      toast.error('O nome deve ter no máximo 100 caracteres.')
      return
    }

    const descricaoTrimmed = descricao.trim()
    const finalidadeTrimmed = finalidade.trim()

    const dados: OrientacaoFuncionalRequest = {
      nome: nomeTrimmed,
      descricao: descricaoTrimmed || null,
      finalidade: finalidadeTrimmed || null,
      tagsIds: tagsSelecionadas,
    }

    setSalvando(true)
    try {
      await orientacaoFuncionalService.criar(dados, imagem)
      toast.success('Exercício cadastrado com sucesso.')
      navigate('/atividades')
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : 'Erro ao cadastrar exercício.'
      )
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="px-4 pt-4 sm:px-6 sm:pt-6 lg:px-8">
        <BotaoVoltar onClick={() => navigate('/atividades')}>Voltar</BotaoVoltar>
      </div>

      <main className="mt-3 flex-1 overflow-y-auto p-4 sm:mt-4 sm:p-6 lg:p-8">
        <div className="mx-auto w-full max-w-2xl">
          <form
            onSubmit={handleSubmit}
            className="rounded-xl bg-white p-4 shadow-[0_4px_24px_rgba(0,0,0,0.06)] sm:p-6 md:p-8"
          >
            <header className="mb-6">
              <h1 className="text-xl font-semibold text-text sm:text-2xl">
                Novo exercício
              </h1>
              <p className="mt-1 text-sm text-text-muted">
                Cadastre uma orientação funcional no catálogo global.
              </p>
            </header>

            <div className="flex flex-col gap-4">
              <Input
                id="nome-exercicio"
                label="Nome"
                size="compact"
                placeholder="Ex: Caminhada"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                maxLength={100}
              />

              <div>
                <label
                  htmlFor="descricao-exercicio"
                  className="mb-1.5 block text-sm font-medium text-text"
                >
                  Descrição (opcional)
                </label>
                <textarea
                  id="descricao-exercicio"
                  rows={3}
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Descreva o exercício"
                  className="w-full resize-none rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div>
                <label
                  htmlFor="finalidade-exercicio"
                  className="mb-1.5 block text-sm font-medium text-text"
                >
                  Finalidade (opcional)
                </label>
                <textarea
                  id="finalidade-exercicio"
                  rows={2}
                  value={finalidade}
                  onChange={(e) => setFinalidade(e.target.value)}
                  placeholder="Objetivo do exercício"
                  className="w-full resize-none rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <SeletorTags
                tags={tagsDisponiveis}
                selecionadas={tagsSelecionadas}
                onChange={setTagsSelecionadas}
                loading={tagsLoading}
                erro={tagsErro}
              />

              <div>
                <p className="mb-1.5 text-sm font-medium text-text">
                  Imagem (opcional)
                </p>
                {previewUrl ? (
                  <div className="relative inline-block">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="h-36 rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={removerImagem}
                      className="absolute -right-2 -top-2 rounded-full bg-white p-1 shadow transition hover:bg-zinc-100"
                      aria-label="Remover imagem"
                    >
                      <FiX className="size-4 text-zinc-600" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 rounded-lg border border-dashed border-zinc-300 px-4 py-3 text-sm text-zinc-500 transition hover:border-brand-400 hover:text-brand-500"
                  >
                    <FiUpload className="size-4" aria-hidden />
                    Selecionar imagem
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    handleImagemSelecionada(e.target.files?.[0])
                  }
                />
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row-reverse sm:items-center">
              <BotaoSalvar type="submit" disabled={salvando} className="sm:min-w-48">
                {salvando ? 'Salvando...' : 'Salvar exercício'}
              </BotaoSalvar>
              <BotaoCancelar
                onClick={() => navigate('/atividades')}
                disabled={salvando}
              >
                Cancelar
              </BotaoCancelar>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
