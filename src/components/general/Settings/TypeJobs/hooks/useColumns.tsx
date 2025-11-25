import { Button } from '@/components/ui/button';
import type { TypeJobs } from '../types'
import { ArrowUpDown } from 'lucide-react';
import { ColumnDef, Row } from '@tanstack/react-table';

export const useColumns = (onEdit?: (position: TypeJobs) => void) => {
  const columns: ColumnDef<TypeJobs>[] = [
    {
      header: () => {
        return (
          <Button variant="ghost" className="text-center">
            Código
            <ArrowUpDown />
          </Button>
        );
      },
      accessorKey: "id"
    },
    {
      header: "Puesto",
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
      cell: ({ row }: { row: Row<TypeJobs> }) => {
        const position = row.original as TypeJobs;
        return (
          <Button 
            variant="outline" 
            onClick={() => onEdit?.(position)}
          >
            Editar
          </Button>
        );
      }
    }
  ];

  return columns;
};