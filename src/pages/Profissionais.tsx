import { useState } from "react";
import { toast } from "sonner";
import {
  EmptyState,
  ButtonCadastro,
  ModalCadastroProfissional,
  TableViewProfessional,
  InputBusca,
} from "@/components";
import type { Professional } from "@/components/TableViewProfessional";
import { profissionalService } from "@/services";
import emptystateSvg from "@/assets/emptystate.svg";

// vou deixar esse mock aqui, quando for pra fazer a integracao so tirar
const profissionaisMock: Professional[] = [
  {
    id: 1,
    name: "Ana Clara Silva",
    phone: "(11) 99999-1234",
    status: "active",
  },
  {
    id: 2,
    name: "Roberto Almeida",
    phone: "(21) 98888-5678",
    status: "inactive",
  },
  {
    id: 3,
    name: "Mariana Costa",
    phone: "(31) 97777-9012",
    status: "active",
  },
  {
    id: 4,
    name: "João Pedro Santos",
    phone: "(41) 96666-3456",
    status: "active",
  },
  {
    id: 5,
    name: "Fernanda Oliveira",
    phone: "(51) 95555-7890",
    status: "inactive",
  },
  {
    id: 6,
    name: "Carlos Souza",
    phone: "(61) 94444-1234",
    status: "active",
  },
  {
    id: 7,
    name: "Juliana Santos",
    phone: "(71) 93333-5678",
    status: "active",
  },
  {
    id: 8,
    name: "Felipe Mendes",
    phone: "(81) 92222-9012",
    status: "inactive",
  },
  {
    id: 9,
    name: "Beatriz Lima",
    phone: "(91) 91111-3456",
    status: "active",
  },
  {
    id: 10,
    name: "Daniel Ferreira",
    phone: "(85) 98765-4321",
    status: "active",
  },
  {
    id: 11,
    name: "Isabela Martins",
    phone: "(31) 97654-3210",
    status: "inactive",
  },
  {
    id: 12,
    name: "Lucas Dias",
    phone: "(41) 96543-2109",
    status: "active",
  },
  {
    id: 13,
    name: "Marina Gomes",
    phone: "(51) 95432-1098",
    status: "active",
  },
  {
    id: 14,
    name: "Paulo Xavier",
    phone: "(61) 94321-0987",
    status: "inactive",
  },
  {
    id: 15,
    name: "Amanda Costa",
    phone: "(71) 93210-9876",
    status: "active",
  },
];

export function Profissionais() {
  const [modalAberto, setModalAberto] = useState(false);
  const [termoBusca, setTermoBusca] = useState("");
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [profissionais] = useState<Professional[]>(profissionaisMock);

  const profissionaisFiltrados = profissionais.filter((prof) =>
    prof.name.toLowerCase().includes(termoBusca.toLowerCase()),
  );

  function handleAdicionarProfissional() {
    setModalAberto(true);
  }

  async function handleSubmitCadastro(dados: Record<string, string>) {
    try {
      await profissionalService.cadastrar(dados);
      toast.success("Profissional cadastrado com sucesso.");
      setModalAberto(false);
      setTabelaVisivel(true);
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Erro ao cadastrar profissional.",
      );
      throw e;
    }
  }

  return (
    <div className="flex min-h-full flex-col p-8">
      <div className="-mx-8 border-b border-[#E5E7EB] px-8 pb-3 shadow-[0_2px_6px_rgba(0,0,0,0.06)]">
        <h1 className="font-heading text-2xl font-semibold text-text">
          Gerenciamento de Profissionais da Saúde
        </h1>
      </div>

      <div className="flex min-h-0 flex-1 flex-col mt-6">
        {tabelaVisivel ? (
          <div className="flex flex-col gap-4">
            <div className="flex w-full items-center gap-4">
              <div className="flex-1">
                <InputBusca
                  value={termoBusca}
                  onChange={(e) => setTermoBusca(e.target.value)}
                />
              </div>

              <ButtonCadastro
                label="Adicionar profissional"
                onClick={handleAdicionarProfissional}
              />
            </div>

            <TableViewProfessional
              key={termoBusca}
              profissionais={profissionaisFiltrados}
            />
          </div>
        ) : (
          <EmptyState
            illustration={
              <img src={emptystateSvg} alt="" className="max-h-64 w-auto" />
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

      <ModalCadastroProfissional
        aberto={modalAberto}
        onFechar={() => setModalAberto(false)}
        onSubmit={handleSubmitCadastro}
      />
    </div>
  );
}
