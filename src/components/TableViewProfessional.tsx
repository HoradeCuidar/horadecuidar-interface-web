import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { IconeOlho, IconeEditar, IconeFechar } from "@/components/icons";
import { profissionalService } from "@/services/profissional";

export interface Professional {
  id: number;
  name: string;
  phone: string;
  status: "active" | "inactive";
}

interface TableViewProfessionalProps {
  profissionais: Professional[];
  onVerDetalhes?: (professional: Professional) => void;
}

const ITEMS_PER_PAGE = 7;

export function TableViewProfessional({
  profissionais = [],
  onVerDetalhes,
}: TableViewProfessionalProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(profissionais.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const profissionaisPaginados = profissionais.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  return (
    <div className="w-full flex flex-col gap-6 overflow-visible pb-0">
      <div className="w-full rounded-xl bg-[#E6EEFF] p-4 dark:bg-zinc-950 overflow-visible">
        <Table>
          <TableHeader>
            <TableRow className="border-none hover:bg-transparent">
              <TableHead className="text-center font-bold text-black text-base">
                Nome
              </TableHead>
              <TableHead className="text-center font-bold text-black text-base">
                Telefone
              </TableHead>
              <TableHead className="text-center font-bold text-black text-base">
                Status
              </TableHead>
              <TableHead className="text-center font-bold text-black text-base">
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {profissionaisPaginados.map((professional) => (
              <TableRow
                key={professional.id}
                className="bg-[#FAFAFA] border-none hover:bg-white shadow-sm transition-all"
              >
                <TableCell className="py-4 text-center font-medium text-zinc-700">
                  {professional.name}
                </TableCell>

                <TableCell className="py-4 text-center text-zinc-600">
                  {professional.phone}
                </TableCell>

                <TableCell className="py-4 text-center">
                  <Badge
                    className={`
                      border-0 px-4 py-1.5 font-light text-[12px] rounded-xl hover:bg-opacity-90
                      ${
                        professional.status === "active"
                          ? "bg-[#3EC048] text-white"
                          : "bg-[#C53032] text-white"
                      }
                    `}
                  >
                    <IconeEditar />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={async () => {
                      const action = professional.status === "active" ? "inativar" : "reativar";
                      if (!window.confirm(`Deseja ${action} ${professional.name}?`)) return;
                      try {
                        await profissionalService.toggleStatusProfissional(
                          professional.id,
                          professional.status === "active" ? "inactive" : "active"
                        );
                      } catch (err) {
                        alert('Erro ao alterar status do profissional');
                        console.error(err);
                      }
                    }}
                    className={`h-9 w-9 rounded-full ${
                      professional.status === "active"
                        ? "text-red-600 hover:bg-red-100"
                        : "text-green-600 hover:bg-green-100"
                    }`}
                    title={professional.status === "active" ? "Inativar" : "Reativar"}
                  >
                    {professional.status === "active" ? "Inativar" : "Reativar"}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
                    {professional.status === "active" ? "Ativo" : "Inativo"}
                  </Badge>
                </TableCell>

                <TableCell className="py-4 text-center">
                  <div className="flex items-center justify-center">
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
                      onClick={() => onVerDetalhes?.(professional)}
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center py-3 mt-2">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={handlePreviousPage}
                  className={`${
                    currentPage === 1 ? "pointer-events-none opacity-50" : "bg-brand-100 text-brand-600 hover:bg-brand-200"
                  }`}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => handlePageChange(page)}
                      isActive={page === currentPage}
                      className={
                        page === currentPage
                          ? "bg-brand-600 text-white hover:bg-brand-700 border-brand-600"
                          : "bg-brand-100 text-brand-600 hover:bg-brand-200 border-brand-100"
                      }
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ),
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={handleNextPage}
                  className={`${
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "bg-brand-100 text-brand-600 hover:bg-brand-200"
                  }`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
