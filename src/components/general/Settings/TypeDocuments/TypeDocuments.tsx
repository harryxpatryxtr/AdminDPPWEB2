'use client'
import { useNewData } from '@/hooks/useData'
import { DataTable } from '../../DataTable'
import { useColumns } from './hooks/useColumns'
import dataDummy from '@/data/dataDummy.json'
import { ColumnDef } from '@tanstack/react-table'
import type { TypeDocuments } from './types'
import { ModalCreateDocuments } from './components'
import { Modal } from '@/components/general'
import { Button } from '@/components/ui/button'

export function TypeDocuments() {
  const { newData, setNewData } = useNewData<TypeDocuments[]>(dataDummy.documentTypes);
  const columns = useColumns((data: TypeDocuments) => {
    setNewData([...newData, data]);
  });
  return (
    <>
      <h1 className="text-2xl font-bold">Type Documents Page</h1>
      <DataTable data={dataDummy.documentTypes} columns={columns as ColumnDef<unknown>[]} />
      
      <Modal
        trigger={<Button variant="outline">Crear</Button>}
        data={<ModalCreateDocuments />}
        title="Crear Tipo de Documento"
        subTitle="Crear un nuevo tipo de documento"
        setOpen={() => {}}
        open={false}
      />
    </>
  )
}