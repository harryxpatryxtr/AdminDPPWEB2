'use client'
import { useNewData } from '@/hooks/useData'
import { DataTable } from '../../DataTable'
import { useColumns } from './hooks/useColumns'
import dataDummy from '@/data/dataDummy.json'
import { ColumnDef } from '@tanstack/react-table'
import type { TypeDocuments } from './types'

export function TypeDocuments() {
  const { newData, setNewData } = useNewData<TypeDocuments[]>(dataDummy.documentTypes);
  const columns = useColumns((data: TypeDocuments) => {
    setNewData([...newData, data]);
  });
  return (
    <>
      <h1 className="text-2xl font-bold">Type Documents Page</h1>
      <DataTable data={dataDummy.documentTypes} columns={columns as ColumnDef<unknown>[]} />
    </>
  )
}