import { Button } from "@/components/ui/button";
import { ColumnDef, Row } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import type { User } from "../types";
import { formatDate, StateBadge } from "../../common";

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
      accessorKey: "user"
    },
    {
      header: "Nombre",
      id: "fullName",
      accessorFn: (row) => row.fullName || '-'
    },
    {
      header: "Email",
      accessorKey: "email"
    },
    {
      header: "Documento",
      id: "document",
      accessorFn: (row) => [row.idTypeDocument?.name, row.documentNumber].filter(Boolean).join(' ') || '-'
    },
    {
      header: "Puesto",
      id: "position",
      accessorFn: (row) => row.idTypeCargo?.name ?? '-'
    },
    {
      header: "Roles",
      id: "roles",
      cell: ({ row }) => {
        const roles = row.original.roles;
        if (roles.length === 0) {
          return <span className="text-muted-foreground">Sin rol</span>;
        }
        return (
          <div className="flex flex-wrap gap-1">
            {roles.map(role => (
              <span key={role.idDb} className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                {role.name}
              </span>
            ))}
          </div>
        );
      }
    },
    {
      header: "Creado",
      accessorKey: "createdAt",
      cell: ({ row }) => formatDate(row.original.createdAt)
    },
    {
      header: "Estado",
      accessorKey: "state",
      cell: ({ row }) => <StateBadge state={row.original.state} />
    },
    ...(onEdit ? [{
      header: "Acciones",
      accessorKey: "acciones",
      cell: ({ row }: { row: Row<User> }) => (
        <Button
          variant="outline"
          onClick={() => onEdit(row.original)}
        >
          Editar
        </Button>
      )
    }] : [])
  ];

  return columns;
};
