import { apiGet, apiPost, apiPut } from '@/lib/apiClient';
import type { Role } from '@/components/general/Settings/Role/types';
import type { Permission } from '@/components/general/Settings/Permission/types';

export interface RoleResponse {
  roles?: Role[];
  message?: string;
  data?: {
    roles?: Role[];
  };
}

export interface CreateRoleRequest {
  id: string;
  name: string;
  description: string;
}

export interface UpdateRoleRequest {
  id: string;
  name: string;
  description: string;
}

export interface SetPermissionRequest {
  id: string;
  permissionId: string;
  roleId: string;
}

export const roleService = {
  /**
   * Obtiene todos los roles
   */
  async getAllRoles(): Promise<Role[]> {
    try {
      const response = await apiGet<RoleResponse>('/role/getAll');
      console.log(response);
      // La API puede retornar los datos en diferentes formatos
      if (Array.isArray(response)) {
        return response;
      }
      
      if (response.data && response.data.roles && Array.isArray(response.data.roles)) {
        return response.data.roles;
      }
      
      if (response.data && Array.isArray(response.data)) {
        return response.data;
      }
      
      // Si no hay datos, retornar array vacío
      return [];
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error al obtener roles: ${error.message}`);
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  /**
   * Crea un nuevo rol
   */
  async createRole(data: CreateRoleRequest): Promise<Role> {
    try {
      const response = await apiPost<Role>('/role/register', data);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error al crear rol: ${error.message}`);
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  /**
   * Actualiza un rol existente
   */
  async updateRole(data: UpdateRoleRequest): Promise<Role> {
    try {
      return await apiPut<Role>('/role/update', data);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Asigna un permiso a un rol
   */
  async setPermission(data: SetPermissionRequest): Promise<any> {
    try {
      const response = await apiPost('/role/setPermission', data);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error al asignar permiso: ${error.message}`);
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  /**
   * Obtiene los permisos de un rol
   */
  async getPermissionsByRole(roleId: string): Promise<Permission[]> {
    try {
      const response = await apiGet<any>(`/role/getPermissions/${roleId}`);
      
      // La API puede retornar los datos en diferentes formatos
      if (Array.isArray(response)) {
        return response;
      }
      
      if (response.data && Array.isArray(response.data)) {
        return response.data;
      }
      
      if (response.permissions && Array.isArray(response.permissions)) {
        return response.permissions;
      }
      
      return [];
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error al obtener permisos del rol: ${error.message}`);
      }
      throw new Error('Error de conexión con el servidor');
    }
  },
};

