import { apiGet, apiPost, apiPut } from '@/lib/apiClient';
import type { User } from '@/components/general/Settings/User/types';

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role: string; // _id de Mongo del rol
}

export interface UpdateUserRequest {
  id: string; // _id de Mongo del usuario
  username?: string;
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  isActive?: boolean;
}

export const userService = {
  /**
   * Obtiene todos los usuarios (activos e inactivos)
   */
  async getAllUsers(): Promise<User[]> {
    try {
      const response = await apiGet<{ data?: { users?: User[] } }>('/user/getAll');
      return response.data?.users ?? [];
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error al obtener usuarios: ${error.message}`);
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  /**
   * Crea un nuevo usuario
   */
  async createUser(data: CreateUserRequest): Promise<User | undefined> {
    try {
      const response = await apiPost<{ data?: { user?: User } }>('/user/register', data);
      return response.data?.user;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error al crear usuario: ${error.message}`);
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  /**
   * Actualiza un usuario existente
   */
  async updateUser(data: UpdateUserRequest): Promise<User | undefined> {
    try {
      const response = await apiPut<{ data?: { user?: User } }>('/user/update', data);
      return response.data?.user;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error al actualizar usuario: ${error.message}`);
      }
      throw new Error('Error de conexión con el servidor');
    }
  },
};
