import { Button } from "@/components/ui/button";
import { ColumnDef, Row } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import type { Role } from "../types";
import { authorName, formatDate, StateBadge } from "../../common";

export const useColumns = (
  onEdit?: (role: Role) => void,
  onManagePermissions?: (role: Role) => void
) => {
  const columns: ColumnDef<Role>[] = [
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
      header: "Rol",
      accessorKey: "name"
    },
    {
      header: "Descripción",
      accessorKey: "description"
    },
    {
      header: "Permisos",
      id: "permissions",
      cell: ({ row }) => {
        const names = (row.original.permissions ?? [])
          .map(assignment => assignment.permission?.name)
          .filter((name): name is string => Boolean(name));
        if (names.length === 0) {
          return <span className="text-muted-foreground">Sin permisos</span>;
        }
        return (
          <div className="flex flex-wrap gap-1">
            {names.slice(0, 3).map(name => (
              <span key={name} className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                {name}
              </span>
            ))}
            {names.length > 3 && (
              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                +{names.length - 3} más
              </span>
            )}
          </div>
        );
      }
    },
    {
      header: "Autor",
      id: "author",
      accessorFn: (row) => authorName(row.userCreated)
    },
    {
      header: "Fecha",
      accessorKey: "createdAt",
      cell: ({ row }) => formatDate(row.original.createdAt)
    },
    {
      header: "Estado",
      accessorKey: "state",
      cell: ({ row }) => <StateBadge state={row.original.state} />
    },
    {
      header: "Acciones",
      accessorKey: "acciones",
      cell: ({ row }: { row: Row<Role> }) => {
        const role = row.original as Role;
        return (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onEdit?.(role)}
            >
              Editar
            </Button>
            <Button
              variant="outline"
              onClick={() => onManagePermissions?.(role)}
            >
              Permisos
            </Button>
          </div>
        );
      }
    }
  ];

  return columns;
};

