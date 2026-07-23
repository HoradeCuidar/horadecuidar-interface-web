import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { FiCheckCircle, FiEdit2, FiEye, FiSlash } from "react-icons/fi";

import {
  EmptyState,
  ButtonCadastro,
  ModalCadastroProfissional,
  ModalDetalhesProfissional,
  DataTable,
  InputBusca,
  ModalConfirmacaoStatus,
  ModalEditarProfissional,
  Skeleton,
} from "@/components";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconeUsuario } from "@/components/icons";
import type { ColumnDef } from "@/components/DataTable";

export interface Professional {
  id: number;
  name: string;
  phone: string;
  status: "active" | "inactive";
}

import { profissionalService } from "@/services";

import emptystateSvg from "@/assets/emptystate.svg";
import { EmptyPesquisar } from "@/components/illustrations/EmptyPesquisar";

type ProfissionalApiItem = { id: number; nome: string; telefone?: string; status?: string }

function mapToProfessional(it: ProfissionalApiItem): Professional {
  return {
    id: it.id,
    name: it.nome,
    phone: it.telefone ?? "",
    status: it.status?.toLowerCase().startsWith("a") ? "active" : "inactive",
  }
}

export function Profissionais() {
  const [modalAberto, setModalAberto] = useState(false);
  const [detalhesId, setDetalhesId] = useState<number | null>(null);
  const [termoBusca, setTermoBusca] = useState("");
  const [profissionais, setProfissionais] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [jaTeveProfissionais, setJaTeveProfissionais] = useState(false);
  const buscaTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [confirmacaoStatusAberto, setConfirmacaoStatusAberto] = useState(false);
  const [profissionalAcaoId, setProfissionalAcaoId] = useState<number | null>(null);
  const [novoStatusAcao, setNovoStatusAcao] = useState<'active' | 'inactive' | null>(null);

  const [modalEditarAberto, setModalEditarAberto] = useState(false);
  const [profissionalEditarId, setProfissionalEditarId] = useState<number | null>(null);

  function handleEditar(id: number) {
    setProfissionalEditarId(id);
    setModalEditarAberto(true);
  }

  const columns: ColumnDef<Professional>[] = [
    {
      header: "Nome",
      headerClassName: "text-left text-base font-bold text-text",
      className: "py-4 text-left",
      render: (item) => (
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-600">
            <IconeUsuario className="size-4 shrink-0" />
          </span>
          <span className="font-heading font-medium tracking-tight text-text-muted">
            {item.name}
          </span>
        </div>
      ),
    },
    { header: "Telefone", accessorKey: "phone", className: "py-4 text-center text-text-muted" },
    {
      header: "Status",
      className: "py-4 text-center",
      render: (item) => (
        <Badge
          className={`rounded-xl border-0 px-4 py-1.5 text-[12px] font-semibold text-white ${
            item.status === "active" ? "bg-success-500" : "bg-error-500"
          }`}
        >
          {item.status === "active" ? "Ativo" : "Inativo"}
        </Badge>
      ),
    },
    {
      header: "Ações",
      className: "py-4 text-center",
      render: (item) => (
        <div className="flex items-center justify-center gap-0.5">
          {item.status === "active" ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-error-500 hover:bg-error-500/15 hover:text-error-700"
              title="Inativar"
              onClick={() => {
                setProfissionalAcaoId(item.id)
                setNovoStatusAcao('inactive')
                setConfirmacaoStatusAberto(true)
              }}
            >
              <FiSlash className="size-4" aria-hidden />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-success-500 hover:bg-success-500/15 hover:text-success-700"
              title="Ativar"
              onClick={() => {
                setProfissionalAcaoId(item.id)
                setNovoStatusAcao('active')
                setConfirmacaoStatusAberto(true)
              }}
            >
              <FiCheckCircle className="size-4" aria-hidden />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-brand-600 hover:bg-brand-100 hover:text-brand-700"
            title="Visualizar"
            onClick={() => setDetalhesId(item.id)}
          >
            <FiEye className="size-4" aria-hidden />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-brand-600 hover:bg-brand-100 hover:text-brand-700"
            title="Editar"
            onClick={() => handleEditar(item.id)}
          >
            <FiEdit2 className="size-4" aria-hidden />
          </Button>
        </div>
      ),
    },
  ];

  async function loadProfissionais() {
    setLoading(true);
    try {
      const items = await profissionalService.listar();
      const mapped = items.map(mapToProfessional);
      setProfissionais(mapped);
      if (mapped.length > 0) setJaTeveProfissionais(true);
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Erro ao buscar profissionais",
      );
    } finally {
      setLoading(false);
    }
  }

  async function doBusca(termo: string) {
    try {
      const items = await profissionalService.buscar(termo);
      setProfissionais(items.map(mapToProfessional));
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Erro ao buscar profissionais",
      );
    }
  }

  function handleBusca(termo: string) {
    setTermoBusca(termo);

    if (buscaTimeout.current) {
      clearTimeout(buscaTimeout.current);
    }

    if (termo.trim() === "") {
      buscaTimeout.current = setTimeout(() => {
        loadProfissionais();
      }, 150);
      return;
    }

    buscaTimeout.current = setTimeout(() => {
      doBusca(termo);
    }, 300);
  }

  function handleAdicionarProfissional() {
    setModalAberto(true);
  }

  async function handleSubmitCadastro(dados: Record<string, string>) {
    try {
      await profissionalService.cadastrar(dados);
      toast.success("Profissional cadastrado com sucesso.");
      setModalAberto(false);
      await loadProfissionais();
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Erro ao cadastrar profissional.",
      );
      throw e;
    }
  }

  useEffect(() => {
    loadProfissionais();

    return () => {
      if (buscaTimeout.current) {
        clearTimeout(buscaTimeout.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col pt-8 px-8 pb-0 overflow-visible">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-text">
          Profissionais de Saúde
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 font-normal">
          Gerencie os profissionais de saúde do sistema e controle suas credenciais de acesso
        </p>
      </div>

      <div className="flex flex-col mt-6 overflow-visible">
        {loading ? (
          <div className="flex flex-col gap-4">
            <div className="flex w-full items-center gap-4">
              <div className="flex-1">
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
              <Skeleton className="h-10 w-44 rounded-xl" />
            </div>

            <div className="w-full overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="grid grid-cols-4 border-b border-zinc-200 bg-zinc-50 p-4 text-center dark:border-zinc-800 dark:bg-zinc-950">
                <div className="text-xs font-semibold text-zinc-500 uppercase">Nome</div>
                <div className="text-xs font-semibold text-zinc-500 uppercase">Telefone</div>
                <div className="text-xs font-semibold text-zinc-500 uppercase">Status</div>
                <div className="text-xs font-semibold text-zinc-500 uppercase">Ações</div>
              </div>
              <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="grid grid-cols-4 items-center p-4">
                    <div className="flex justify-center">
                      <Skeleton className="h-4 w-40" />
                    </div>
                    <div className="flex justify-center">
                      <Skeleton className="h-4 w-28" />
                    </div>
                    <div className="flex justify-center">
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                    <div className="flex justify-center gap-2">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {jaTeveProfissionais && (
              <div className="flex w-full items-center gap-4">
                <div className="flex-1">
                  <InputBusca
                    value={termoBusca}
                    onChange={(e) => handleBusca(e.target.value)}
                  />
                </div>

                <ButtonCadastro
                  label="Adicionar profissional"
                  onClick={handleAdicionarProfissional}
                />
              </div>
            )}

      
            {profissionais.length > 0 ? (
              <DataTable
                data={profissionais}
                columns={columns}
              />
            ) : termoBusca.trim() !== "" ? (
              <EmptyState
                illustration={<EmptyPesquisar />}
                title="Nenhum resultado encontrado"
                description="Nada encontrado. Verifique se esse profissional está cadastrado."
                illustrationClassName="mb-1"
                className="min-h-[60vh]"
              />
            ) : (
              <EmptyState
                illustration={
                  <div className="bg-white p-6 rounded-xl shadow-lg">
                    <img
                      src={emptystateSvg}
                      alt=""
                      className="mx-auto max-h-[32rem] w-auto"
                    />
                  </div>
                }
                title="Nenhum profissional da saúde encontrado!"
                description="Cadastre um novo profissional para visualizar suas informações."
              >
                <ButtonCadastro
                  label="Adicionar profissional"
                  onClick={handleAdicionarProfissional}
                />
              </EmptyState>
            )}
          </div>
        )}
      </div>

      <ModalCadastroProfissional
        aberto={modalAberto}
        onFechar={() => setModalAberto(false)}
        onSubmit={handleSubmitCadastro}
      />

      <ModalDetalhesProfissional
        aberto={detalhesId !== null}
        onFechar={() => setDetalhesId(null)}
        profissionalId={detalhesId}
      />

      <ModalConfirmacaoStatus
        aberto={confirmacaoStatusAberto}
        onFechar={() => setConfirmacaoStatusAberto(false)}
        onSucesso={() => loadProfissionais()}
        profissionalId={profissionalAcaoId}
        novoStatus={novoStatusAcao}
      />

      <ModalEditarProfissional
        aberto={modalEditarAberto}
        onFechar={() => {
          setModalEditarAberto(false);
          setProfissionalEditarId(null);
        }}
        profissionalId={profissionalEditarId}
        onSucesso={() => loadProfissionais()}
      />
    </div>
  );
}
