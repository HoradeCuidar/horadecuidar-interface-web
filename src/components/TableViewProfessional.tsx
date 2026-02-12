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

//dados mocados, vou deixar aqui mesmo, quando for fazer a req é so remover
const professionals = [
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
];

export function TableViewProfessional() {
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
          {professionals.map((professional) => (
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
