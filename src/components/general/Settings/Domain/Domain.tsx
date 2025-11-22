'use client'
import { useNewData } from '@/hooks/useData'
import { DataTable } from '../../DataTable'
import { useColumns } from './hooks/useColumns'
import dataDummy from '@/data/dataDummy.json'
import { ColumnDef } from '@tanstack/react-table'
import type { Domain } from './types'

export function Domain() {
  const { newData, setNewData } = useNewData(dataDummy.domains);
  const columns = useColumns((data: Domain) => {
    setNewData([...newData, data]);
  });
  return (
    <>
      <h1 className="text-2xl font-bold">Domain Page</h1>
      <DataTable data={dataDummy.domains} columns={columns as ColumnDef<unknown>[]} />
    </>
  )
}