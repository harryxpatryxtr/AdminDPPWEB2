'use client'
import { DataTable } from '../../DataTable'
import { useColumns } from './hooks/useColumns'
import { ColumnDef } from '@tanstack/react-table'
import type { Domain } from './types'
import { Button } from '@/components/ui/button'
import { Modal } from '../../Modal'
import { useState, useEffect } from 'react'
import { ModalCreateDomain, ModalUpdateDomain } from './components/'
import React from 'react'
import { domainService } from '@/services/domainService'
import { useAuth } from '@/contexts/AuthContext'

export function Domain() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleEdit = (domain: Domain) => {
    setSelectedDomain(domain);
    setOpenUpdate(true);
  };

  const handleUpdateSuccess = () => {
    setOpenUpdate(false);
    setSelectedDomain(null);
    handleRefresh();
  };

  const columns = useColumns(handleEdit);

  // Cargar dominios desde la API
  useEffect(() => {
    const fetchDomains = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await domainService.getAllDomains();
        setDomains(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al cargar dominios';
        setError(errorMessage);
        console.error('Error fetching domains:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDomains();
  }, [isAuthenticated, refreshKey]);

  const headerActions = [
    <Modal
      key="nuevo-dominio"
      trigger={<Button>Nuevo</Button>}
      data={
        <ModalCreateDomain
          onSuccess={() => {
            setOpenCreate(false);
            handleRefresh();
          }}
          onClose={() => setOpenCreate(false)}
        />
      }
      subTitle="Crear nuevo dominio"
      title="Nuevo dominio"
      setOpen={() => setOpenCreate(!openCreate)}
      open={openCreate}
    />
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando dominios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-medium">Error al cargar dominios</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Domain Page</h1>
      <DataTable
        data={domains}
        columns={columns as ColumnDef<unknown>[]} 
        headerActions={headerActions}
      />
      {domains.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          No hay dominios disponibles
        </div>
      )}
      {selectedDomain && (
        <Modal
          trigger={<span style={{ display: 'none' }} />}
          data={
            <ModalUpdateDomain
              domain={selectedDomain}
              onSuccess={handleUpdateSuccess}
              onClose={() => {
                setOpenUpdate(false);
                setSelectedDomain(null);
              }}
            />
          }
          subTitle="Editar el dominio"
          title="Editar dominio"
          setOpen={() => {
            setOpenUpdate(!openUpdate);
            if (!openUpdate) {
              setSelectedDomain(null);
            }
          }}
          open={openUpdate}
        />
      )}
    </>
  )
}