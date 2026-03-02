import { useState } from "react";
import { toast } from "sonner";
import { EmptyState, ButtonCadastro, ModalCadastroPaciente } from "@/components";
import emptyPacienteSvg from "@/assets/empty-paciente.svg";
import { pacienteService } from "@/services/paciente";

export function Pacientes() {
  const [modalCadastroAberto, setModalCadastroAberto] = useState(false);

  function handleCadastrarPaciente() {
    setModalCadastroAberto(true);
  }

  async function handleSubmitPaciente(dados: Record<string, unknown>) {
    await pacienteService.cadastrar(dados);
    toast.success("Paciente cadastrado com sucesso.");
  }

  return (
    <div className="flex flex-col pt-8 px-8 pb-0 overflow-visible">
      <div className="-mx-8 border-b border-[#E5E7EB] px-8 pb-3 shadow-[0_2px_6px_rgba(0,0,0,0.06)]">
        <h1 className="font-heading text-xl font-semibold text-text">
          Gerenciamento de Pacientes
        </h1>
      </div>

      <div className="flex flex-col mt-6 overflow-visible">
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
      </div>

      <ModalCadastroPaciente
        aberto={modalCadastroAberto}
        onFechar={() => setModalCadastroAberto(false)}
        onSubmit={handleSubmitPaciente}
      />
    </div>
  );
}
