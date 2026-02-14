import { useState, useEffect } from "react";
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


export function Profissionais() {
  const [modalAberto, setModalAberto] = useState(false);
  const [termoBusca, setTermoBusca] = useState("");
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [profissionais, setProfissionais] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadProfissionais() {
    setLoading(true)
    try {
      const items = await profissionalService.listar()
      const mapped: Professional[] = items.map((it: any) => ({
        id: it.id,
        name: it.nome,
        phone: it.telefone ?? "",
        status: it.status && it.status.toLowerCase().startsWith("a") ? "active" : "inactive",
      }))
      setProfissionais(mapped)
      setTabelaVisivel(mapped.length > 0)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Erro ao buscar profissionais')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProfissionais()
  }, [])

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
      await loadProfissionais();
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
        {loading ? (
          <div className="p-8">Carregando profissionais...</div>
        ) : tabelaVisivel ? (
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
