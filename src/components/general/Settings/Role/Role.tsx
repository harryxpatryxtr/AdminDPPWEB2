'use client'
import { DataTable } from '../../DataTable'
import { useColumns } from './hooks/useColumns'
import { ColumnDef } from '@tanstack/react-table'
import type { Role } from './types'
import { Button } from '@/components/ui/button'
import { Modal } from '../../Modal'
import { useState, useEffect } from 'react'
import { ModalCreateRole, ModalAssignPermissions, ModalUpdateRole } from './components/'
import { roleService } from '@/services/roleService'
import { useAuth } from '@/contexts/AuthContext'

export function Role() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  
  const [openCreate, setOpenCreate] = useState(false);
  const [openAssign, setOpenAssign] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleEdit = (role: Role) => {
    setSelectedRole(role);
    setOpenUpdate(true);
  };

  const handleUpdateSuccess = () => {
    setOpenUpdate(false);
    setSelectedRole(null);
    handleRefresh();
  };

  const columns = useColumns(handleEdit);

  // Cargar roles desde la API
  useEffect(() => {
    const fetchRoles = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await roleService.getAllRoles();
        setRoles(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al cargar roles';
        setError(errorMessage);
        console.error('Error fetching roles:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, [isAuthenticated, refreshKey]);

  const headerActions = [
    <Modal
      key="nuevo-rol"
      trigger={<Button>Crear Roles</Button>}
      data={
        <ModalCreateRole
          onSuccess={() => {
            setOpenCreate(false);
            handleRefresh();
          }}
          onClose={() => setOpenCreate(false)}
        />
      }
      subTitle="Crear nuevo rol"
      title="Nuevo rol"
      setOpen={() => setOpenCreate(!openCreate)}
      open={openCreate}
    />,
    <Modal
      key="asignar-permisos"
      trigger={<Button variant="outline">Asignar</Button>}
      data={
        <ModalAssignPermissions
          roles={roles}
          onSuccess={() => {
            setOpenAssign(false);
            handleRefresh();
          }}
          onClose={() => setOpenAssign(false)}
        />
      }
      subTitle="Asignar permisos a un rol"
      title="Asignar permisos"
      setOpen={() => setOpenAssign(!openAssign)}
      open={openAssign}
    />
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando roles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-medium">Error al cargar roles</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Roles</h1>
      <DataTable
        data={roles}
        columns={columns as ColumnDef<unknown>[]} 
        headerActions={headerActions}
      />
      {roles.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          No hay roles disponibles
        </div>
      )}
      {selectedRole && (
        <Modal
          trigger={<span style={{ display: 'none' }} />}
          data={
            <ModalUpdateRole
              role={selectedRole}
              onSuccess={handleUpdateSuccess}
              onClose={() => {
                setOpenUpdate(false);
                setSelectedRole(null);
              }}
            />
          }
          subTitle="Editar el rol"
          title="Editar rol"
          setOpen={() => {
            setOpenUpdate(!openUpdate);
            if (!openUpdate) {
              setSelectedRole(null);
            }
          }}
          open={openUpdate}
        />
      )}
    </>
  )
}

