import { useState, type ReactNode } from "react";
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
  headerClassName?: string;
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
    <div className="flex w-full flex-col gap-6 overflow-visible pb-0">
      <div className="w-full overflow-visible rounded-xl border border-zinc-200 bg-white p-4 shadow-card">
        <Table>
          <TableHeader>
            <TableRow className="border-none hover:bg-transparent">
              {columns.map((col, index) => (
                <TableHead
                  key={index}
                  className={
                    col.headerClassName ||
                    "text-center text-base font-bold text-text"
                  }
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
                  className="py-8 text-center text-text-muted"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  className="border-none bg-surface-0 shadow-sm transition-all hover:bg-surface-100"
                >
                  {columns.map((col, colIndex) => (
                    <TableCell
                      key={colIndex}
                      className={
                        col.className || "py-4 text-center text-text-muted"
                      }
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
        <div className="mt-2 flex justify-center py-3">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={handlePreviousPage}
                  className={`${
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer bg-brand-100 text-brand-600 hover:bg-brand-200"
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
                        ? "cursor-pointer border-brand-600 bg-brand-600 text-white hover:bg-brand-700"
                        : "cursor-pointer border-brand-100 bg-brand-100 text-brand-600 hover:bg-brand-200"
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
                      : "cursor-pointer bg-brand-100 text-brand-600 hover:bg-brand-200"
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
