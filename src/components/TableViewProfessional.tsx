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
import { IconeOlho, IconeEditar, IconeFechar } from "@/components/icons";
export interface Professional {
  id: number;
  name: string;
  phone: string;
  status: "active" | "inactive";
}

interface TableViewProfessionalProps {
  profissionais: Professional[];
}

export function TableViewProfessional({
  profissionais = [],
}: TableViewProfessionalProps) {
  return (
    <div className="w-full rounded-xl bg-[#E6EEFF] p-4 dark:bg-zinc-950">
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
          {profissionais.map((professional) => (
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
  );
}
