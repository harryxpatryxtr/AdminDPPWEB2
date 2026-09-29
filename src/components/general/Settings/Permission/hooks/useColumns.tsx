import { Button } from "@/components/ui/button";
import { ColumnDef, Row } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import type { Permission } from "../types";
import { authorName, StateBadge } from "../../common";

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
      id: "author",
      accessorFn: (row) => authorName(row.userCreated)
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
      cell: ({ row }) => <StateBadge state={row.original.state} />
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

