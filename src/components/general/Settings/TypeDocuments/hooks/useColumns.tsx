import { Button } from "@/components/ui/button";
import { Column, Row } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import type { TypeDocuments } from "../types";

export const useColumns = (setNewData: (data: TypeDocuments) => void) => {
  return [
    {
      header: ({ column }: { column: Column<TypeDocuments> }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-center"
          >
            Codigo
            <ArrowUpDown />
          </Button>
        );
      },
      accessorKey: "codigo"
    },
    {
      header: "Tipo de Documento",
      accessorKey: "typeDocument"
    },
    {
      header: "Descripcion",
      accessorKey: "descripcion"
    },
    {
      header: "Autor",
      accessorKey: "autor"
    },
    {
      header: "Estado",
      accessorKey: "status"
    },
    {
      header: "Acciones",
      accessorKey: "acciones",
      cell: ({ row }: { row: Row<TypeDocuments> }) => {
        const typeDocument = row.original as TypeDocuments;
        return (
          <Button variant="outline">Editar</Button>
        );
      }
    }
  ]
}