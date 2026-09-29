import { Button } from "@/components/ui/button";
import { ColumnDef, Row } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import type { TypeDocuments } from "../types";
import { StateBadge } from "../../common";

export const useColumns = (onEdit?: (typeDocument: TypeDocuments) => void) => {
  const columns: ColumnDef<TypeDocuments>[] = [
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
      header: "Tipo de Documento",
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
      cell: ({ row }: { row: Row<TypeDocuments> }) => {
        const typeDocument = row.original as TypeDocuments;
        return (
          <Button 
            variant="outline" 
            onClick={() => onEdit?.(typeDocument)}
          >
            Editar
          </Button>
        );
      }
    }
  ];

  return columns;
};