import { Button } from "@/components/ui/button";
import { ColumnDef, Row } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import type { Permission } from "../types";

export const useColumns = (onEdit?: (permission: Permission) => void) => {
  const columns: ColumnDef<Permission>[] = [
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
      header: "Permiso",
      accessorKey: "name"
    },
    {
      header: "Descripción",
      accessorKey: "description"
    },
    {
      header: "Autor",
      accessorKey: "author"
    },
    {
      header: "Fecha",
      accessorKey: "date",
      cell: ({ row }) => {
        const date = row.getValue("date") as string;
        if (!date) return '-';
        try {
          const dateObj = new Date(date);
          return dateObj.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          });
        } catch {
          return date;
        }
      }
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
      cell: ({ row }: { row: Row<Permission> }) => {
        const permission = row.original as Permission;
        return (
          <Button 
            variant="outline" 
            onClick={() => onEdit?.(permission)}
          >
            Editar
          </Button>
        );
      }
    }
  ];

  return columns;
};

