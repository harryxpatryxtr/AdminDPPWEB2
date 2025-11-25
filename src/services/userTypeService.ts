import { apiGet, apiPost, apiPut } from '@/lib/apiClient';
import type { TypeUsers } from '@/components/general/Settings/TypeUsers/types';

export interface UserTypeResponse {
  userTypes?: TypeUsers[];
  message?: string;
  data?: {
    userTypes?: TypeUsers[];
  };
}

export interface CreateUserTypeRequest {
  id: string;
  name: string;
  description: string;
}

export interface UpdateUserTypeRequest {
  id: string;
  description: string;
  name?: string;
  state?: string;
}

export const userTypeService = {
  /**
   * Obtiene todos los tipos de usuario
   */
  async getAllUserTypes(): Promise<TypeUsers[]> {
    try {
      const response = await apiGet<UserTypeResponse>('/userType/getAll');
      console.log(response);
      // La API puede retornar los datos en diferentes formatos
      if (Array.isArray(response)) {
        return response;
      }
      
      if (response.data && response.data.userTypes && Array.isArray(response.data.userTypes)) {
        return response.data.userTypes;
      }
      
      if (response.data && Array.isArray(response.data)) {
        return response.data;
      }
      
      // Si no hay datos, retornar array vacío
      return [];
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error al obtener tipos de usuario: ${error.message}`);
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  /**
   * Crea un nuevo tipo de usuario
   */
  async createUserType(data: CreateUserTypeRequest): Promise<TypeUsers> {
    try {
      const response = await apiPost<TypeUsers>('/userType/register', data);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error al crear tipo de usuario: ${error.message}`);
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  /**
   * Actualiza un tipo de usuario existente
   */
  async updateUserType(data: UpdateUserTypeRequest): Promise<TypeUsers> {
    try {
      return await apiPut<TypeUsers>('/userType/update', data);
    } catch (error) {
      throw error;
    }
  },
};

