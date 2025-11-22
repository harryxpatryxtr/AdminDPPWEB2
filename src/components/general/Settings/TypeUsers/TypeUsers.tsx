'use client'
import { useNewData } from '@/hooks/useData'
import { DataTable } from '../../DataTable'
import { useColumns } from './hooks/useColumns'
import dataDummy from '@/data/dataDummy.json'
import { ColumnDef } from '@tanstack/react-table'
import type { TypeUsers } from './types'

export function TypeUsers() {
  const { newData, setNewData } = useNewData<TypeUsers[]>(dataDummy.userTypes);
  const columns = useColumns((data: TypeUsers) => {
    setNewData([...newData, data]);
  });
  return (
    <>
      <h1 className="text-2xl font-bold">Type Users Page</h1>
      <DataTable data={dataDummy.userTypes} columns={columns as ColumnDef<unknown>[]} />
    </>
  )
}