import { useEffect, useState } from "react";
import { Modal } from "@/components";
import { Avatar } from "@/components/ui/Avatar";
import { profissionalService } from "@/services";
import {
  IconeEmail,
  IconeTelefone,
  IconeCalendario,
  IconeUsuario,
  IconeEdificio,
  IconeCasa,
  IconeMapPin,
  IconeMapa,
} from "@/components/icons";

export type DetalhesProfissional = {
  id: number;
  nome: string;
  email?: string;
  telefone?: string;
  dataNascimento?: string;
  genero?: string;
  status?: string;
  rua?: string;
  numeroDaCasa?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
};

type ModalDetalhesProfissionalProps = {
  aberto: boolean;
  onFechar: () => void;
  profissionalId: number | null;
};

function formatarData(value?: string): string {
  if (!value?.trim()) return "—";
  const s = value.trim();
  if (s.includes("/")) return s;
  const [y, m, d] = s.split("-");
  if (!d || !m || !y) return s;
  return `${d.padStart(2, "0")}/${parseInt(m, 10)}/${y}`;
}

function formatarGenero(g?: string): string {
  if (!g?.trim()) return "—";
  const map: Record<string, string> = {
    MASCULINO: "Masculino",
    FEMININO: "Feminino",
    NAO_BINARIO: "Não binário",
    OUTRO: "Outro",
  };
  return map[g.toUpperCase()] ?? g;
}

export function ModalDetalhesProfissional({
  aberto,
  onFechar,
  profissionalId,
}: ModalDetalhesProfissionalProps) {
  const [dados, setDados] = useState<DetalhesProfissional | null>(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (!aberto || profissionalId == null) {
      setDados(null);
      setErro(null);
      return;
    }
    setLoading(true);
    setErro(null);
    profissionalService
      .buscarPorId(profissionalId)
      .then((res) => {
        setDados(res as DetalhesProfissional);
      })
      .catch((e) => {
        setErro(e instanceof Error ? e.message : "Erro ao carregar detalhes.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [aberto, profissionalId]);

  return (
    <Modal
      aberto={aberto}
      onFechar={onFechar}
      titulo="Detalhes do Profissional"
      largura="md"
      showCloseButton
    >
      {loading && (
        <div className="flex items-center justify-center py-12 text-zinc-500">
          Carregando...
        </div>
      )}
      {erro && (
        <div className="py-8 text-center text-sm text-red-600">{erro}</div>
      )}
      {!loading && !erro && dados && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
          <div className="flex shrink-0 flex-col items-center justify-center gap-1.5 sm:w-52">
            <Avatar
              name={dados.nome}
              className="size-20 text-xl bg-[#E6EEFF] text-brand-600"
            />
            <p className="text-center text-base font-semibold text-text leading-tight">
              {dados.nome}
            </p>
            <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              Profissional da Saúde
            </span>
          </div>

          <div className="min-w-0 flex-1 max-w-2xl space-y-3">
            <section className="w-fit rounded-lg bg-[#E6EEFF]/50">
              <h3 className="rounded-t-lg bg-[#E6EEFF] px-3 py-2 text-sm font-semibold text-text">
                Informações Gerais
              </h3>
              <ul className="space-y-2 px-3 py-2">
                <li className="flex items-center gap-2.5 text-sm">
                  <span className="flex items-center gap-2">
                    {dados.status?.toLowerCase().startsWith("a") ? (
                      <>
                        <span className="size-2 rounded-full bg-[#3EC048]" />
                        <span className="text-text">Ativo</span>
                      </>
                    ) : (
                      <>
                        <span className="size-2 rounded-full bg-[#C53032]" />
                        <span className="text-text">Inativo</span>
                      </>
                    )}
                  </span>
                </li>
                <li className="flex items-center gap-2.5 text-sm text-zinc-700">
                  <IconeEmail className="size-4 shrink-0 text-zinc-400" />
                  <span>{dados.email || "—"}</span>
                </li>
                <li className="flex items-center gap-2.5 text-sm text-zinc-700">
                  <IconeTelefone className="size-4 shrink-0 text-zinc-400" />
                  <span>{dados.telefone || "—"}</span>
                </li>
                <li className="flex items-center gap-2.5 text-sm text-zinc-700">
                  <IconeCalendario className="size-4 shrink-0 text-zinc-400" />
                  <span>{formatarData(dados.dataNascimento)}</span>
                </li>
                <li className="flex items-center gap-2.5 text-sm text-zinc-700">
                  <IconeUsuario className="size-4 shrink-0 text-zinc-400" />
                  <span>{formatarGenero(dados.genero)}</span>
                </li>
              </ul>
            </section>

            <section className="w-fit rounded-lg bg-[#E6EEFF]/50">
              <h3 className="rounded-t-lg bg-[#E6EEFF] px-3 py-2 text-sm font-semibold text-text">
                Endereço
              </h3>
              <ul className="space-y-2 px-3 py-2">
                <li className="flex items-center gap-2.5 text-sm text-zinc-700">
                  <IconeEdificio className="size-4 shrink-0 text-zinc-400" />
                  <span>{dados.rua || "—"}</span>
                </li>
                <li className="flex items-center gap-2.5 text-sm text-zinc-700">
                  <IconeCasa className="size-4 shrink-0 text-zinc-400" />
                  <span>{dados.numeroDaCasa || "—"}</span>
                </li>
                <li className="flex items-center gap-2.5 text-sm text-zinc-700">
                  <IconeMapPin className="size-4 shrink-0 text-zinc-400" />
                  <span>{dados.bairro || "—"}</span>
                </li>
                <li className="flex items-center gap-2.5 text-sm text-zinc-700">
                  <IconeEdificio className="size-4 shrink-0 text-zinc-400" />
                  <span>{dados.cidade || "—"}</span>
                </li>
                <li className="flex items-center gap-2.5 text-sm text-zinc-700">
                  <IconeMapa className="size-4 shrink-0 text-zinc-400" />
                  <span>{dados.estado || "—"}</span>
                </li>
              </ul>
            </section>
          </div>
        </div>
      )}
    </Modal>
  );
}
