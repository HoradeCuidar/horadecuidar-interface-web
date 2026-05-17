import { useState, ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export interface ColumnDef<T> {
  header: string | ReactNode;
  accessorKey?: keyof T;
  className?: string;
  render?: (item: T) => ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  itemsPerPage?: number;
  emptyMessage?: string | ReactNode;
}

export function DataTable<T>({
  data = [],
  columns,
  itemsPerPage = 7,
  emptyMessage = "Nenhum dado encontrado.",
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);

  const handlePreviousPage = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePageChange = (page: number, e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentPage(page);
  };

  return (
    <div className="w-full flex flex-col gap-6 overflow-visible pb-0">
      <div className="w-full rounded-xl bg-[#E6EEFF] p-4 dark:bg-zinc-950 overflow-visible">
        <Table>
          <TableHeader>
            <TableRow className="border-none hover:bg-transparent">
              {columns.map((col, index) => (
                <TableHead
                  key={index}
                  className="text-center font-bold text-black text-base"
                >
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow className="border-none hover:bg-transparent">
                <TableCell
                  colSpan={columns.length}
                  className="py-8 text-center text-zinc-500"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  className="bg-[#FAFAFA] border-none hover:bg-white shadow-sm transition-all"
                >
                  {columns.map((col, colIndex) => (
                    <TableCell
                      key={colIndex}
                      className={col.className || "py-4 text-center text-zinc-600"}
                    >
                      {col.render
                        ? col.render(item)
                        : col.accessorKey
                        ? String(item[col.accessorKey] || "")
                        : null}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center py-3 mt-2">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={handlePreviousPage}
                  className={`${
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "bg-brand-100 text-brand-600 hover:bg-brand-200 cursor-pointer"
                  }`}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => handlePageChange(page, e)}
                    isActive={page === currentPage}
                    className={
                      page === currentPage
                        ? "bg-brand-600 text-white hover:bg-brand-700 border-brand-600 cursor-pointer"
                        : "bg-brand-100 text-brand-600 hover:bg-brand-200 border-brand-100 cursor-pointer"
                    }
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={handleNextPage}
                  className={`${
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "bg-brand-100 text-brand-600 hover:bg-brand-200 cursor-pointer"
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
