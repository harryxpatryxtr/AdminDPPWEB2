import { Button } from '@/components/ui/button';
import type { TypeJobs } from '../types'
import { ArrowUpDown } from 'lucide-react';
import { Column, Row } from '@tanstack/react-table';

export const useColumns = (setNewData: (data: TypeJobs) => void) => {
  return [
    {
      header: ({ column }: { column: Column<TypeJobs> }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Código
            <ArrowUpDown />
          </Button>
        );
      },
      accessorKey: "codigo"
    },
    {
      header: "Puesto",
      accessorKey: "job"
    },
    {
      header: "Descripción",
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
      cell: ({ row }: { row: Row<TypeJobs> }) => {
        const typeJob = row.original as TypeJobs;
        return <Button variant="outline">Editar</Button>;
      }
    }
  ]
}