import { apiGet, apiPost, apiPut } from '@/lib/apiClient';
import type { Permission } from '@/components/general/Settings/Permission/types';

export interface PermissionResponse {
  permissions?: Permission[];
  message?: string;
  data?: {
    permissions?: Permission[];
  };
}

export interface CreatePermissionRequest {
  id: string;
  name: string;
  description: string;
}

export interface UpdatePermissionRequest {
  id: string;
  description: string;
  name?: string;
  state?: string;
}

export const permissionService = {
  /**
   * Obtiene todos los permisos
   */
  async getAllPermissions(): Promise<Permission[]> {
    try {
      const response = await apiGet<PermissionResponse>('/permission/getAll');
      console.log(response);
      // La API puede retornar los datos en diferentes formatos
      if (Array.isArray(response)) {
        return response;
      }
      
      if (response.data && response.data.permissions && Array.isArray(response.data.permissions)) {
        return response.data.permissions;
      }
      
      if (response.data && Array.isArray(response.data)) {
        return response.data;
      }
      
      // Si no hay datos, retornar array vacío
      return [];
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error al obtener permisos: ${error.message}`);
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  /**
   * Crea un nuevo permiso
   */
  async createPermission(data: CreatePermissionRequest): Promise<Permission> {
    try {
      const response = await apiPost<Permission>('/permission/register', data);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error al crear permiso: ${error.message}`);
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  /**
   * Actualiza un permiso existente
   */
  async updatePermission(data: UpdatePermissionRequest): Promise<Permission> {
    try {
      return await apiPut<Permission>('/permission/update', data);
    } catch (error) {
      throw error;
    }
  },
};

