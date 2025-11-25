'use client'
import { DataTable } from '../../DataTable'
import { useColumns } from './hooks/useColumns'
import { ColumnDef } from '@tanstack/react-table'
import type { TypeUsers } from './types'
import { Button } from '@/components/ui/button'
import { Modal } from '../../Modal'
import { useState, useEffect } from 'react'
import { ModalCreateTypeUser, ModalUpdateTypeUser } from './components/'
import React from 'react'
import { userTypeService } from '@/services/userTypeService'
import { useAuth } from '@/contexts/AuthContext'

export function TypeUsers() {
  const [userTypes, setUserTypes] = useState<TypeUsers[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [selectedTypeUser, setSelectedTypeUser] = useState<TypeUsers | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleEdit = (typeUser: TypeUsers) => {
    setSelectedTypeUser(typeUser);
    setOpenUpdate(true);
  };

  const handleUpdateSuccess = () => {
    setOpenUpdate(false);
    setSelectedTypeUser(null);
    handleRefresh();
  };

  const columns = useColumns(handleEdit);

  // Cargar tipos de usuario desde la API
  useEffect(() => {
    const fetchUserTypes = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await userTypeService.getAllUserTypes();
        setUserTypes(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al cargar tipos de usuario';
        setError(errorMessage);
        console.error('Error fetching user types:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserTypes();
  }, [isAuthenticated, refreshKey]);

  const headerActions = [
    <Modal
      key="nuevo-tipo-usuario"
      trigger={<Button>Nuevo</Button>}
      data={
        <ModalCreateTypeUser
          onSuccess={() => {
            setOpenCreate(false);
            handleRefresh();
          }}
          onClose={() => setOpenCreate(false)}
        />
      }
      subTitle="Crear nuevo tipo de usuario"
      title="Nuevo tipo de usuario"
      setOpen={() => setOpenCreate(!openCreate)}
      open={openCreate}
    />
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando tipos de usuario...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-medium">Error al cargar tipos de usuario</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Type Users Page</h1>
      <DataTable
        data={userTypes}
        columns={columns as ColumnDef<unknown>[]} 
        headerActions={headerActions}
      />
      {userTypes.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          No hay tipos de usuario disponibles
        </div>
      )}
      {selectedTypeUser && (
        <Modal
          trigger={<span style={{ display: 'none' }} />}
          data={
            <ModalUpdateTypeUser
              typeUser={selectedTypeUser}
              onSuccess={handleUpdateSuccess}
              onClose={() => {
                setOpenUpdate(false);
                setSelectedTypeUser(null);
              }}
            />
          }
          subTitle="Editar el tipo de usuario"
          title="Editar tipo de usuario"
          setOpen={() => {
            setOpenUpdate(!openUpdate);
            if (!openUpdate) {
              setSelectedTypeUser(null);
            }
          }}
          open={openUpdate}
        />
      )}
    </>
  )
}