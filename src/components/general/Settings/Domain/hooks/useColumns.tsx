import { Button } from "@/components/ui/button";
import { ColumnDef, Row } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import type { Domain } from '../types';

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
      header: "Autor",
      accessorKey: "author"
    },
    {
      header: "Estado",
      accessorKey: "state",
      cell: ({ row }) => {
        const state = row.getValue("state") as string;
        return (
          <span className={`px-2 py-1 rounded-full text-xs ${
            state === 'active' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {state === 'active' ? 'Activo' : 'Inactivo'}
          </span>
        );
      }
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
