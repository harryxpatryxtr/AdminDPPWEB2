'use client'
import { DataTable } from "../../DataTable";
import { ColumnDef } from '@tanstack/react-table'
import { useColumns } from './hooks/useColumns'
import type { TypeJobs } from './types';
import { Button } from '@/components/ui/button'
import { Modal } from '../../Modal'
import { useState, useEffect } from 'react'
import { ModalCreatePosition, ModalUpdatePosition } from './components/'
import { positionService } from '@/services/positionService'
import { useAuth } from '@/contexts/AuthContext'

export function TypeJobs() {
  const [positions, setPositions] = useState<TypeJobs[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<TypeJobs | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleEdit = (position: TypeJobs) => {
    setSelectedPosition(position);
    setOpenUpdate(true);
  };

  const handleUpdateSuccess = () => {
    setOpenUpdate(false);
    setSelectedPosition(null);
    handleRefresh();
  };

  const columns = useColumns(handleEdit);

  // Cargar puestos desde la API
  useEffect(() => {
    const fetchPositions = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await positionService.getAllPositions();
        setPositions(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al cargar puestos';
        setError(errorMessage);
        console.error('Error fetching positions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPositions();
  }, [isAuthenticated, refreshKey]);

  const headerActions = [
    <Modal
      key="nuevo-puesto"
      trigger={<Button>Nuevo</Button>}
      data={
        <ModalCreatePosition
          onSuccess={() => {
            setOpenCreate(false);
            handleRefresh();
          }}
          onClose={() => setOpenCreate(false)}
        />
      }
      subTitle="Crear nuevo puesto"
      title="Nuevo puesto"
      setOpen={() => setOpenCreate(!openCreate)}
      open={openCreate}
    />
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando puestos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-medium">Error al cargar puestos</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Type Jobs Page</h1>
      <DataTable
        data={positions}
        columns={columns as ColumnDef<unknown>[]} 
        headerActions={headerActions}
      />
      {positions.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          No hay puestos disponibles
        </div>
      )}
      {selectedPosition && (
        <Modal
          trigger={<span style={{ display: 'none' }} />}
          data={
            <ModalUpdatePosition
              position={selectedPosition}
              onSuccess={handleUpdateSuccess}
              onClose={() => {
                setOpenUpdate(false);
                setSelectedPosition(null);
              }}
            />
          }
          subTitle="Editar el puesto"
          title="Editar puesto"
          setOpen={() => {
            setOpenUpdate(!openUpdate);
            if (!openUpdate) {
              setSelectedPosition(null);
            }
          }}
          open={openUpdate}
        />
      )}
    </>
  )
}