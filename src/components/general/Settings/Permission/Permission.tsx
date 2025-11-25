'use client'
import { DataTable } from '../../DataTable'
import { useColumns } from './hooks/useColumns'
import { ColumnDef } from '@tanstack/react-table'
import type { Permission } from './types'
import { Button } from '@/components/ui/button'
import { Modal } from '../../Modal'
import { useState, useEffect } from 'react'
import { ModalCreatePermission, ModalUpdatePermission } from './components/'
import { permissionService } from '@/services/permissionService'
import { useAuth } from '@/contexts/AuthContext'

export function Permission() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleEdit = (permission: Permission) => {
    setSelectedPermission(permission);
    setOpenUpdate(true);
  };

  const handleUpdateSuccess = () => {
    setOpenUpdate(false);
    setSelectedPermission(null);
    handleRefresh();
  };

  const columns = useColumns(handleEdit);

  // Cargar permisos desde la API
  useEffect(() => {
    const fetchPermissions = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await permissionService.getAllPermissions();
        setPermissions(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al cargar permisos';
        setError(errorMessage);
        console.error('Error fetching permissions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, [isAuthenticated, refreshKey]);

  const headerActions = [
    <Modal
      key="nuevo-permiso"
      trigger={<Button>Nuevo</Button>}
      data={
        <ModalCreatePermission
          onSuccess={() => {
            setOpenCreate(false);
            handleRefresh();
          }}
          onClose={() => setOpenCreate(false)}
        />
      }
      subTitle="Crear nuevo permiso"
      title="Nuevo permiso"
      setOpen={() => setOpenCreate(!openCreate)}
      open={openCreate}
    />
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando permisos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-medium">Error al cargar permisos</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Permisos</h1>
      <DataTable
        data={permissions}
        columns={columns as ColumnDef<unknown>[]} 
        headerActions={headerActions}
      />
      {permissions.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          No hay permisos disponibles
        </div>
      )}
      {selectedPermission && (
        <Modal
          trigger={<span style={{ display: 'none' }} />}
          data={
            <ModalUpdatePermission
              permission={selectedPermission}
              onSuccess={handleUpdateSuccess}
              onClose={() => {
                setOpenUpdate(false);
                setSelectedPermission(null);
              }}
            />
          }
          subTitle="Editar el permiso"
          title="Editar permiso"
          setOpen={() => {
            setOpenUpdate(!openUpdate);
            if (!openUpdate) {
              setSelectedPermission(null);
            }
          }}
          open={openUpdate}
        />
      )}
    </>
  )
}

