'use client'
import { DataTable } from '../../DataTable'
import { useColumns } from './hooks/useColumns'
import { ColumnDef } from '@tanstack/react-table'
import type { TypeDocuments } from './types'
import { ModalCreateDocuments, ModalUpdateDocuments } from './components'
import { Modal } from '../../Modal'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { documentTypeService } from '@/services/documentTypeService'
import { useAuth } from '@/contexts/AuthContext'

export function TypeDocuments() {
  const [documentTypes, setDocumentTypes] = useState<TypeDocuments[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [selectedTypeDocument, setSelectedTypeDocument] = useState<TypeDocuments | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleEdit = (typeDocument: TypeDocuments) => {
    setSelectedTypeDocument(typeDocument);
    setOpenUpdate(true);
  };

  const handleUpdateSuccess = () => {
    setOpenUpdate(false);
    setSelectedTypeDocument(null);
    handleRefresh();
  };

  const columns = useColumns(handleEdit);

  // Cargar tipos de documento desde la API
  useEffect(() => {
    const fetchDocumentTypes = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await documentTypeService.getAllDocumentTypes();
        setDocumentTypes(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al cargar tipos de documento';
        setError(errorMessage);
        console.error('Error fetching document types:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocumentTypes();
  }, [isAuthenticated, refreshKey]);

  const headerActions = [
    <Modal
      key="nuevo-tipo-documento"
      trigger={<Button>Nuevo</Button>}
      data={
        <ModalCreateDocuments
          onSuccess={() => {
            setOpenCreate(false);
            handleRefresh();
          }}
          onClose={() => setOpenCreate(false)}
        />
      }
      subTitle="Crear nuevo tipo de documento"
      title="Nuevo tipo de documento"
      setOpen={() => setOpenCreate(!openCreate)}
      open={openCreate}
    />
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando tipos de documento...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-medium">Error al cargar tipos de documento</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Type Documents Page</h1>
      <DataTable
        data={documentTypes}
        columns={columns as ColumnDef<unknown>[]} 
        headerActions={headerActions}
      />
      {documentTypes.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          No hay tipos de documento disponibles
        </div>
      )}
      {selectedTypeDocument && (
        <Modal
          trigger={<span style={{ display: 'none' }} />}
          data={
            <ModalUpdateDocuments
              typeDocument={selectedTypeDocument}
              onSuccess={handleUpdateSuccess}
              onClose={() => {
                setOpenUpdate(false);
                setSelectedTypeDocument(null);
              }}
            />
          }
          subTitle="Editar el tipo de documento"
          title="Editar tipo de documento"
          setOpen={() => {
            setOpenUpdate(!openUpdate);
            if (!openUpdate) {
              setSelectedTypeDocument(null);
            }
          }}
          open={openUpdate}
        />
      )}
    </>
  )
}