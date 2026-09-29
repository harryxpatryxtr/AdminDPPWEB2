import { Button } from "@/components/ui/button";
import { ColumnDef, Row } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import type { User } from "../types";
import { formatDate, StateBadge } from "../../common";

export const fullName = (user: User) =>
  user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || '-';

export const useColumns = (onEdit?: (user: User) => void) => {
  const columns: ColumnDef<User>[] = [
    {
      header: () => {
        return (
          <Button
            variant="ghost"
            className="text-center"
          >
            Usuario
            <ArrowUpDown />
          </Button>
        );
      },
      accessorKey: "username"
    },
    {
      header: "Nombre",
      id: "fullName",
      accessorFn: (row) => fullName(row)
    },
    {
      header: "Email",
      accessorKey: "email"
    },
    {
      header: "Rol",
      id: "role",
      accessorFn: (row) => row.role?.name ?? 'Sin rol'
    },
    {
      header: "Creado",
      accessorKey: "createdAt",
      cell: ({ row }) => formatDate(row.original.createdAt)
    },
    {
      header: "Estado",
      accessorKey: "isActive",
      cell: ({ row }) => <StateBadge state={row.original.isActive ? 1 : 0} />
    },
    {
      header: "Acciones",
      accessorKey: "acciones",
      cell: ({ row }: { row: Row<User> }) => {
        const user = row.original as User;
        return (
          <Button
            variant="outline"
            onClick={() => onEdit?.(user)}
          >
            Editar
          </Button>
        );
      }
    }
  ];

  return columns;
};
