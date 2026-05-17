import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { 
  EmptyState, 
  ButtonCadastro, 
  ModalCadastroPaciente,
  DataTable,
  InputBusca
} from "@/components";
import emptyPacienteSvg from "@/assets/empty-paciente.svg";
import { pacienteService } from "@/services/paciente";
import { EmptyPesquisar } from "@/components/illustrations/EmptyPesquisar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconeOlho, IconeEditar, IconeFechar } from "@/components/icons";
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
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-200 rounded-full"
            title="Remover"
          >
            <IconeFechar />
          </Button>
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
      <div className="-mx-8 border-b border-[#E5E7EB] px-8 pb-3 shadow-[0_2px_6px_rgba(0,0,0,0.06)]">
        <h1 className="font-heading text-xl font-semibold text-text">
          Gerenciamento de Pacientes
        </h1>
      </div>

      <div className="flex flex-col mt-6 overflow-visible">
        {loading ? (
          <div className="p-8">Carregando pacientes...</div>
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
    </div>
  );
}
