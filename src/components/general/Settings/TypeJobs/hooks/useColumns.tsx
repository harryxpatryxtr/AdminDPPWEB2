import { Button } from '@/components/ui/button';
import type { TypeJobs } from '../types'
import { authorName, StateBadge } from '../../common';
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
      id: "author",
      accessorFn: (row) => authorName(row.userCreated)
    },
    {
      header: "Estado",
      accessorKey: "state",
      cell: ({ row }) => <StateBadge state={row.original.state} />
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