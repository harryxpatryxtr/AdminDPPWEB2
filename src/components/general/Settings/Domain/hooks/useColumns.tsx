import { Button } from "@/components/ui/button";
import { ColumnDef, Row } from "@tanstack/react-table";
// import { Modal } from "../../../Modal";
// import { ModalUpdate } from "../components";
import { ArrowUpDown } from "lucide-react";
import type { Domain } from '../types'

export const useColumns = (setNewData: (data: Domain) => void) => {
  const columns: ColumnDef<Domain>[] = [
    {
      header: () => {
        return (
          <Button
            variant="ghost"
            // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
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
      header: "Dominio",
      accessorKey: "domain"
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
      cell: ({ row }: { row: Row<Domain> }) => {
        const domain = row.original as Domain;
        return (
          <Button variant="outline">Editar</Button>
          // <Modal
          //   trigger={<Button variant="outline">Editar</Button>}
          //   data={
          //     <ModalUpdate dataUpdate={row.original} setNewData={setNewData} />
          //   }
          //   subTitle="Editar el dominio"
          //   title="Editar"
          // />
        );
      }
    }
  ];

  return columns;
};
