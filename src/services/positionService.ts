import { apiGet, apiPost, apiPut } from '@/lib/apiClient';
import type { TypeJobs } from '@/components/general/Settings/TypeJobs/types';

export interface PositionResponse {
  positions?: TypeJobs[];
  message?: string;
  data?: {
    positions?: TypeJobs[];
  };
}

export interface CreatePositionRequest {
  id: string;
  name: string;
  description: string;
}

export interface UpdatePositionRequest {
  id: string;
  description: string;
  name?: string;
  state?: string;
}

export const positionService = {
  /**
   * Obtiene todos los puestos
   */
  async getAllPositions(): Promise<TypeJobs[]> {
    try {
      const response = await apiGet<PositionResponse>('/position/getAll');
      console.log(response);
      // La API puede retornar los datos en diferentes formatos
      if (Array.isArray(response)) {
        return response;
      }
      
      if (response.data && response.data.positions && Array.isArray(response.data.positions)) {
        return response.data.positions;
      }
      
      if (response.data && Array.isArray(response.data)) {
        return response.data;
      }
      
      // Si no hay datos, retornar array vacío
      return [];
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error al obtener puestos: ${error.message}`);
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  /**
   * Crea un nuevo puesto
   */
  async createPosition(data: CreatePositionRequest): Promise<TypeJobs> {
    try {
      const response = await apiPost<TypeJobs>('/position/register', data);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error al crear puesto: ${error.message}`);
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  /**
   * Actualiza un puesto existente
   */
  async updatePosition(data: UpdatePositionRequest): Promise<TypeJobs> {
    try {
      return await apiPut<TypeJobs>('/position/update', data);
    } catch (error) {
      throw error;
    }
  },
};

