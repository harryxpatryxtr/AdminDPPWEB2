import { Button } from "@/components/ui/button";
// import { Modal } from "@/components/general/Modal";
// import { ModalUpdate } from "../components";
import { ArrowUpDown } from "lucide-react";
import type { TypeUsers } from '../types'
import { Column, Row } from "@tanstack/react-table";

export const useColumns = (setNewData: (data: TypeUsers) => void) => {
  const columns = [
    {
      header: ({ column }: { column: Column<TypeUsers> }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
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
      header: "Tipo de Usuario",
      accessorKey: "typeUser"
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
      cell: ({ row }: { row: Row<TypeUsers> }) => {
        const typeUser = row.original as TypeUsers;
        return (
          <Button variant="outline">Editar</Button>
          // <Modal
          //   trigger={<Button variant="outline">Editar</Button>}
          //   data={
          //     <ModalUpdate dataUpdate={row.original} setNewData={setNewData} />
          //   }
          //   subTitle="Editar el tipo de usuario"
          //   title="Editar"
          // />
        );
      }
    }
  ];

  return columns;
};
