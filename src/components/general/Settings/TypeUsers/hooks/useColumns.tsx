import { Button } from "@/components/ui/button";
import { ColumnDef, Row } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import type { TypeUsers } from '../types';
import { StateBadge } from "../../common";

export const useColumns = (onEdit?: (typeUser: TypeUsers) => void) => {
  const columns: ColumnDef<TypeUsers>[] = [
    {
      header: () => {
        return (
          <Button
            variant="ghost"
            className="text-center"
          >
            Codigo
            <ArrowUpDown />
          </Button>
        );
      },
      accessorKey: "id"
    },
    {
      header: "Tipo de Usuario",
      accessorKey: "name"
    },
    {
      header: "Descripcion",
      accessorKey: "description"
    },
    {
      header: "Estado",
      accessorKey: "state",
      cell: ({ row }) => <StateBadge state={row.original.state} />
    },
    {
      header: "Acciones",
      accessorKey: "acciones",
      cell: ({ row }: { row: Row<TypeUsers> }) => {
        const typeUser = row.original as TypeUsers;
        return (
          <Button 
            variant="outline" 
            onClick={() => onEdit?.(typeUser)}
          >
            Editar
          </Button>
        );
      }
    }
  ];

  return columns;
};
