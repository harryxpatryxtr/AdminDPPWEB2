import { apiGet, apiPost, apiPut } from '@/lib/apiClient';
import type { Domain } from '@/components/general/Settings/Domain/types';

export interface DomainResponse {
  domains?: Domain[];
  message?: string;
  data?: {
    domains?: Domain[];
  };
}

export interface CreateDomainRequest {
  id: string;
  name: string;
  description: string;
}

export interface UpdateDomainRequest {
  id: string;
  description: string;
  name?: string;
  state?: string;
}

export const domainService = {
  /**
   * Obtiene todos los dominios
   */
  async getAllDomains(): Promise<Domain[]> {
    try {
      const response = await apiGet<DomainResponse>('/domain/getAll');
      console.log(response);
      // La API puede retornar los datos en diferentes formatos
      if (Array.isArray(response)) {
        return response;
      }
      
      if (response.data && response.data.domains && Array.isArray(response.data.domains)) {
        return response.data.domains;
      }
      
      if (response.data && Array.isArray(response.data)) {
        return response.data;
      }
      
      // Si no hay datos, retornar array vacío
      return [];
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error al obtener dominios: ${error.message}`);
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  /**
   * Crea un nuevo dominio
   */
  async createDomain(data: CreateDomainRequest): Promise<Domain> {
    try {
      const response = await apiPost<Domain>('/domain/register', data);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error al crear dominio: ${error.message}`);
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  /**
   * Actualiza un dominio existente
   */
  async updateDomain(data: UpdateDomainRequest): Promise<Domain> {
    try {
      return await apiPut<Domain>('/domain/update', data);
    } catch (error) {
      throw error;
    }
  },
};

