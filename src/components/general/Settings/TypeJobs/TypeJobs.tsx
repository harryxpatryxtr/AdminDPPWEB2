'use client'
import { DataTable } from "../../DataTable";
import dataDummy from '@/data/dataDummy.json'
import { ColumnDef } from '@tanstack/react-table'
import { useColumns } from './hooks/useColumns'
import { useNewData } from "@/hooks/useData";
import type { TypeJobs } from './types';

export function TypeJobs() {
  const { newData, setNewData } = useNewData<TypeJobs[]>(dataDummy.jobs);
  const columns = useColumns((data: TypeJobs) => {
    setNewData([...newData, data]);
  });
  return (
    <>
      <h1 className="text-2xl font-bold">Type Jobs Page</h1>
      <DataTable data={dataDummy.jobs} columns={columns as ColumnDef<unknown>[]} />
    </>
  )
}