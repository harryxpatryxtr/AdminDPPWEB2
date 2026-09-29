'use client'
import { DataTable } from '../../DataTable'
import { useColumns } from './hooks'
import { ColumnDef } from '@tanstack/react-table'
import type { User as UserType } from './types'
import { Button } from '@/components/ui/button'
import { Modal } from '../../Modal'
import { useState, useEffect } from 'react'
import { ModalCreateUser, ModalUpdateUser } from './components'
import { userService } from '@/services/userService'
import { useAuth } from '@/contexts/AuthContext'

export function User() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleEdit = (user: UserType) => {
    setSelectedUser(user);
    setOpenUpdate(true);
  };

  const closeUpdate = () => {
    setOpenUpdate(false);
    setSelectedUser(null);
  };

  const columns = useColumns(handleEdit);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        setUsers(await userService.getAllUsers());
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar usuarios');
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [isAuthenticated, refreshKey]);

  const headerActions = [
    <Modal
      key="nuevo-usuario"
      trigger={<Button>Nuevo</Button>}
      data={
        <ModalCreateUser
          onSuccess={() => {
            setOpenCreate(false);
            handleRefresh();
          }}
          onClose={() => setOpenCreate(false)}
        />
      }
      subTitle="Crear nuevo usuario"
      title="Nuevo usuario"
      setOpen={() => setOpenCreate(!openCreate)}
      open={openCreate}
    />
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-medium">Error al cargar usuarios</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Usuarios</h1>
      <DataTable
        data={users}
        columns={columns as ColumnDef<unknown>[]}
        headerActions={headerActions}
      />
      {users.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No hay usuarios disponibles
        </div>
      )}
      {selectedUser && (
        <Modal
          trigger={<span style={{ display: 'none' }} />}
          data={
            <ModalUpdateUser
              key={selectedUser._id}
              user={selectedUser}
              onSuccess={() => {
                closeUpdate();
                handleRefresh();
              }}
              onClose={closeUpdate}
            />
          }
          subTitle="Editar el usuario"
          title="Editar usuario"
          setOpen={closeUpdate}
          open={openUpdate}
        />
      )}
    </>
  )
}
