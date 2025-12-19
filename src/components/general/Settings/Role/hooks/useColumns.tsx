import { Button } from "@/components/ui/button";
import { ColumnDef, Row } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import type { Role } from "../types";

export const useColumns = (onEdit?: (role: Role) => void) => {
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
      accessorKey: "permissions",
      cell: ({ row }) => {
        const permissions = row.getValue("permissions") as Role['permissions'];
        if (!permissions || (Array.isArray(permissions) && permissions.length === 0)) {
          return <span className="text-muted-foreground">Sin permisos</span>;
        }
        
        if (Array.isArray(permissions)) {
          // Si es un array de objetos con name
          if (permissions.length > 0 && typeof permissions[0] === 'object' && 'name' in permissions[0]) {
            return (
              <div className="flex flex-wrap gap-1">
                {(permissions as { id: string; name: string }[]).slice(0, 3).map((perm: { id: string; name: string }) => (
                  <span key={perm.id} className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                    {perm.name}
                  </span>
                ))}
                {permissions.length > 3 && (
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                    +{permissions.length - 3} más
                  </span>
                )}
              </div>
            );
          }
          // Si es un array de strings
          return (
            <div className="flex flex-wrap gap-1">
              {permissions.slice(0, 3).map((perm: string) => (
                <span key={perm} className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                  {perm}
                </span>
              ))}
              {permissions.length > 3 && (
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                  +{permissions.length - 3} más
                </span>
              )}
            </div>
          );
        }
        
        return <span className="text-muted-foreground">-</span>;
      }
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
      cell: ({ row }: { row: Row<Role> }) => {
        const role = row.original as Role;
        return (
          <Button 
            variant="outline" 
            onClick={() => onEdit?.(role)}
          >
            Editar
          </Button>
        );
      }
    }
  ];

  return columns;
};

