import { useState } from "react";
import { toast } from "sonner";
import {
  EmptyState,
  ButtonCadastro,
  ModalCadastroProfissional,
  TableViewProfessional,
} from "@/components";
import { profissionalService } from "@/services";
import emptystateSvg from "@/assets/emptystate.svg";

export function Profissionais() {
  const [modalAberto, setModalAberto] = useState(false);
  const [tabelaVisivel, setTabelaVisivel] = useState(true);

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

      <div className="flex min-h-0 flex-1 flex-col">
        {tabelaVisivel ? (
          <TableViewProfessional />
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
