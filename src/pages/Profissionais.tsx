import { useState, useEffect, useRef } from "react";
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
import { EmptyPesquisar } from "@/components/illustrations/EmptyPesquisar";

export function Profissionais() {
  const [modalAberto, setModalAberto] = useState(false);
  const [termoBusca, setTermoBusca] = useState("");
  const [profissionais, setProfissionais] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [jaTeveProfissionais, setJaTeveProfissionais] = useState(false);
  const buscaTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function loadProfissionais() {
    setLoading(true);
    try {
      const items = await profissionalService.listar();
      const mapped: Professional[] = items.map((it: any) => ({
        id: it.id,
        name: it.nome,
        phone: it.telefone ?? "",
        status:
          it.status && it.status.toLowerCase().startsWith("a")
            ? "active"
            : "inactive",
      }));

      setProfissionais(mapped);

      if (mapped.length > 0) {
        setJaTeveProfissionais(true);
      }
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
      const mapped: Professional[] = items.map((it: any) => ({
        id: it.id,
        name: it.nome,
        phone: it.telefone ?? "",
        status:
          it.status && it.status.toLowerCase().startsWith("a")
            ? "active"
            : "inactive",
      }));

      setProfissionais(mapped);
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
      <div className="-mx-8 border-b border-[#E5E7EB] px-8 pb-3 shadow-[0_2px_6px_rgba(0,0,0,0.06)]">
        <h1 className="font-heading text-2xl font-semibold text-text">
          Gerenciamento de Profissionais da Saúde
        </h1>
      </div>

      <div className="flex flex-col mt-6 overflow-visible">
        {loading ? (
          <div className="p-8">Carregando profissionais...</div>
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
              <TableViewProfessional profissionais={profissionais} />
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
    </div>
  );
}
