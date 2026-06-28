import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { 
  EmptyState, 
  ButtonCadastro, 
  ModalCadastroPaciente,
  ModalEditarPaciente,
  ModalConfirmacaoStatusPaciente,
  DataTable,
  InputBusca,
  Skeleton
} from "@/components";
import emptyPacienteSvg from "@/assets/empty-paciente.svg";
import { pacienteService } from "@/services/paciente";
import { EmptyPesquisar } from "@/components/illustrations/EmptyPesquisar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconeOlho, IconeEditar, IconeFechar, IconeCheck } from "@/components/icons";
import type { ColumnDef } from "@/components/DataTable";

export interface Paciente {
  id: number;
  nome: string;
  telefone: string;
  cpf: string;
  status: "active" | "inactive";
}

export function Pacientes() {
  const [modalCadastroAberto, setModalCadastroAberto] = useState(false);
  const [termoBusca, setTermoBusca] = useState("");
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [jaTevePacientes, setJaTevePacientes] = useState(false);
  const buscaTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [confirmacaoStatusAberto, setConfirmacaoStatusAberto] = useState(false);
  const [pacienteAcaoId, setPacienteAcaoId] = useState<number | null>(null);
  const [novoStatusAcao, setNovoStatusAcao] = useState<'active' | 'inactive' | null>(null);
  const [modalEditarAberto, setModalEditarAberto] = useState(false);
  const [pacienteEditarId, setPacienteEditarId] = useState<number | null>(null);

  function handleEditar(id: number) {
    setPacienteEditarId(id);
    setModalEditarAberto(true);
  }

  const columns: ColumnDef<Paciente>[] = [
    { header: "Nome", accessorKey: "nome", className: "py-4 text-center font-medium text-zinc-700" },
    { header: "Telefone", accessorKey: "telefone", className: "py-4 text-center text-zinc-600" },
    {
      header: "Status",
      className: "py-4 text-center",
      render: (item) => (
        <Badge
          className={`border-0 px-4 py-1.5 font-light text-[12px] rounded-xl hover:bg-opacity-90 ${
            item.status === "active" ? "bg-[#3EC048] text-white" : "bg-[#C53032] text-white"
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
        <div className="flex items-center justify-center gap-1">
          {item.status === "active" ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-zinc-400 hover:text-red-600 hover:bg-red-100 rounded-full"
              title="Inativar"
              onClick={() => {
                setPacienteAcaoId(item.id)
                setNovoStatusAcao('inactive')
                setConfirmacaoStatusAberto(true)
              }}
            >
              <IconeFechar />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-zinc-400 hover:text-green-600 hover:bg-green-100 rounded-full"
              title="Ativar"
              onClick={() => {
                setPacienteAcaoId(item.id)
                setNovoStatusAcao('active')
                setConfirmacaoStatusAberto(true)
              }}
            >
              <IconeCheck />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-zinc-400 hover:text-blue-600 hover:bg-blue-100 rounded-full"
            title="Visualizar"
            onClick={() => {
              // placeholder para onVerDetalhes
              console.log("Ver detalhes do paciente", item.id);
            }}
          >
            <IconeOlho />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-zinc-400 hover:text-orange-600 hover:bg-orange-100 rounded-full"
            title="Editar"
            onClick={() => handleEditar(item.id)}
          >
            <IconeEditar />
          </Button>
        </div>
      ),
    },
  ];

  async function loadPacientes() {
    setLoading(true);
    try {
      const items = await pacienteService.listar();
      const mapped: Paciente[] = items.map((it: any) => ({
        id: it.id,
        nome: it.nome,
        telefone: it.telefone ?? "",
        cpf: it.cpf ?? "",
        status:
          it.status && it.status.toLowerCase().startsWith("a")
            ? "active"
            : "inactive",
      }));

      setPacientes(mapped);

      if (mapped.length > 0) {
        setJaTevePacientes(true);
      }
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Erro ao buscar pacientes",
      );
    } finally {
      setLoading(false);
    }
  }

  async function doBusca(termo: string) {
    try {
      const items = await pacienteService.buscar(termo);
      const mapped: Paciente[] = items.map((it: any) => ({
        id: it.id,
        nome: it.nome,
        telefone: it.telefone ?? "",
        cpf: it.cpf ?? "",
        status:
          it.status && it.status.toLowerCase().startsWith("a")
            ? "active"
            : "inactive",
      }));

      setPacientes(mapped);
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Erro ao buscar pacientes",
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
        loadPacientes();
      }, 150);
      return;
    }

    buscaTimeout.current = setTimeout(() => {
      doBusca(termo);
    }, 300);
  }

  function handleCadastrarPaciente() {
    setModalCadastroAberto(true);
  }

  async function handleSubmitPaciente(dados: Record<string, unknown>) {
    await pacienteService.cadastrar(dados);
    toast.success("Paciente cadastrado com sucesso.");
    setModalCadastroAberto(false);
    await loadPacientes();
  }

  useEffect(() => {
    loadPacientes();

    return () => {
      if (buscaTimeout.current) {
        clearTimeout(buscaTimeout.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col pt-8 px-8 pb-0 overflow-visible">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl font-bold text-zinc-800 dark:text-white">
          Pacientes
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 font-normal">
          Acompanhe os pacientes cadastrados, seus planos de tratamento e monitoramentos ativos
        </p>
      </div>

      <div className="flex flex-col mt-6 overflow-visible">
        {loading ? (
          <div className="flex flex-col gap-4">
            <div className="flex w-full items-center gap-4">
              <div className="flex-1">
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
              <Skeleton className="h-10 w-40 rounded-xl" />
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
            {jaTevePacientes && (
              <div className="flex w-full items-center gap-4">
                <div className="flex-1">
                  <InputBusca
                    value={termoBusca}
                    onChange={(e) => handleBusca(e.target.value)}
                  />
                </div>

                <ButtonCadastro
                  label="Cadastrar paciente"
                  onClick={handleCadastrarPaciente}
                />
              </div>
            )}

            {pacientes.length > 0 ? (
              <DataTable
                data={pacientes}
                columns={columns}
              />
            ) : termoBusca.trim() !== "" ? (
              <EmptyState
                illustration={<EmptyPesquisar />}
                title="Nenhum resultado encontrado"
                description="Nada encontrado. Verifique se esse paciente está cadastrado."
                illustrationClassName="mb-1"
                className="min-h-[60vh]"
              />
            ) : (
              <EmptyState
                illustration={
                  <div className="bg-white p-6 rounded-xl shadow-lg">
                    <img
                      src={emptyPacienteSvg}
                      alt=""
                      className="mx-auto max-h-[32rem] w-auto"
                    />
                  </div>
                }
                title="Nenhum paciente encontrado!"
                description="Cadastre um novo paciente para visualizar suas informações."
              >
                <ButtonCadastro
                  label="Cadastrar paciente"
                  onClick={handleCadastrarPaciente}
                />
              </EmptyState>
            )}
          </div>
        )}
      </div>

      <ModalCadastroPaciente
        aberto={modalCadastroAberto}
        onFechar={() => setModalCadastroAberto(false)}
        onSubmit={handleSubmitPaciente}
      />

      <ModalConfirmacaoStatusPaciente
        aberto={confirmacaoStatusAberto}
        onFechar={() => setConfirmacaoStatusAberto(false)}
        onSucesso={() => loadPacientes()}
        pacienteId={pacienteAcaoId}
        novoStatus={novoStatusAcao}
      />

      <ModalEditarPaciente
        aberto={modalEditarAberto}
        onFechar={() => {
          setModalEditarAberto(false);
          setPacienteEditarId(null);
        }}
        pacienteId={pacienteEditarId}
        onSucesso={() => loadPacientes()}
      />
    </div>
  );
}
