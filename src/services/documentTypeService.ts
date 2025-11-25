import { apiGet, apiPost, apiPut } from '@/lib/apiClient';
import type { TypeDocuments } from '@/components/general/Settings/TypeDocuments/types';

export interface DocumentTypeResponse {
  documentTypes?: TypeDocuments[];
  message?: string;
  data?: {
    documentTypes?: TypeDocuments[];
  };
}

export interface CreateDocumentTypeRequest {
  id: string;
  name: string;
  description: string;
}

export interface UpdateDocumentTypeRequest {
  id: string;
  description: string;
  name?: string;
  state?: string;
}

export const documentTypeService = {
  /**
   * Obtiene todos los tipos de documento
   */
  async getAllDocumentTypes(): Promise<TypeDocuments[]> {
    try {
      const response = await apiGet<DocumentTypeResponse>('/documentType/getAll');
      console.log(response);
      // La API puede retornar los datos en diferentes formatos
      if (Array.isArray(response)) {
        return response;
      }
      
      if (response.data && response.data.documentTypes && Array.isArray(response.data.documentTypes)) {
        return response.data.documentTypes;
      }
      
      if (response.data && Array.isArray(response.data)) {
        return response.data;
      }
      
      // Si no hay datos, retornar array vacío
      return [];
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error al obtener tipos de documento: ${error.message}`);
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  /**
   * Crea un nuevo tipo de documento
   */
  async createDocumentType(data: CreateDocumentTypeRequest): Promise<TypeDocuments> {
    try {
      const response = await apiPost<TypeDocuments>('/documentType/register', data);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error al crear tipo de documento: ${error.message}`);
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  /**
   * Actualiza un tipo de documento existente
   */
  async updateDocumentType(data: UpdateDocumentTypeRequest): Promise<TypeDocuments> {
    try {
      return await apiPut<TypeDocuments>('/documentType/update', data);
    } catch (error) {
      throw error;
    }
  },
};

