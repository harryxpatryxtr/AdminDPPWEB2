import { Button } from "@/components/ui/button";
import { ColumnDef, Row } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import type { TypeDocuments } from "../types";

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