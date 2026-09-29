import { Button } from "@/components/ui/button";
import { ColumnDef, Row } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import type { Domain } from '../types';
import { StateBadge } from "../../common";

export const useColumns = (onEdit?: (domain: Domain) => void) => {

  const columns: ColumnDef<Domain>[] = [
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
      header: "Dominio",
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
      cell: ({ row }: { row: Row<Domain> }) => {
        const domain = row.original as Domain;
        return (
          <Button 
            variant="outline" 
            onClick={() => onEdit?.(domain)}
          >
            Editar
          </Button>
        );
      }
    }
  ];

  return columns;
};
