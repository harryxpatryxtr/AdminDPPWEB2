'use client'
import { useNewData } from '@/hooks/useData'
import { DataTable } from '../../DataTable'
import { useColumns } from './hooks/useColumns'
import dataDummy from '@/data/dataDummy.json'
import { ColumnDef } from '@tanstack/react-table'
import type { Domain } from './types'
import { Button } from '@/components/ui/button'
import { Modal } from '../../Modal'
import { useState } from 'react'
import { ModalCreateDomain } from './components/'
import React from 'react'

export function Domain() {
  const { newData, setNewData } = useNewData(dataDummy.domains);
  const columns = useColumns((data: Domain) => {
    setNewData([...newData, data]);
  });
  const [open, setOpen] = useState(false);
  const headerActions = [
    <Modal
      key="nuevo-dominio"
      trigger={<Button>Nuevo</Button>}
      data={<ModalCreateDomain />}
      subTitle="Crear nuevo dominio"
      title="Nuevo dominio"
      setOpen={() => setOpen(!open)}
      open={open}
    />
  ];
  return (
    <>
      <h1 className="text-2xl font-bold">Domain Page</h1>
      <DataTable
        data={dataDummy.domains}
        columns={columns as ColumnDef<unknown>[]} 
        headerActions={headerActions}
      />
    </>
  )
}