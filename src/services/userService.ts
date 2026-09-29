import { apiGet, apiPost, apiPut } from '@/lib/apiClient';
import type { Sex, User } from '@/components/general/Settings/User/types';

// Datos de ficha comunes a crear y editar. Los catálogos van como idDb.
export interface UserProfile {
  firstName?: string;
  paternalSurname?: string;
  maternalSurname?: string;
  cellphone?: string;
  documentNumber?: string;
  sex?: Sex | null;
  idTypeUser?: string | null;
  idTypeDocument?: string | null;
  idTypeCargo?: string | null;
}

export interface CreateUserRequest extends UserProfile {
  user: string;
  email: string;
  password: string;
}

export interface UpdateUserRequest extends UserProfile {
  id: string;
  user?: string;
  email?: string;
  password?: string;
  state?: 0 | 1;
}

const withContext = async <T>(action: string, request: () => Promise<T>): Promise<T> => {
  try {
    return await request();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error al ${action}: ${error.message}`);
    }
    throw new Error('Error de conexión con el servidor');
  }
};

export const userService = {
  /**
   * Usuarios activos e inactivos. El backend pagina; se piden hasta 100.
   */
  getAllUsers(): Promise<User[]> {
    return withContext('obtener usuarios', async () => {
      const response = await apiGet<{ data?: { users?: User[] } }>('/user/getAll?limit=100');
      return response.data?.users ?? [];
    });
  },

  createUser(data: CreateUserRequest): Promise<User> {
    return withContext('crear usuario', async () => {
      const response = await apiPost<{ data: { user: User } }>('/user/register', data);
      return response.data.user;
    });
  },

  updateUser(data: UpdateUserRequest): Promise<User> {
    return withContext('actualizar usuario', async () => {
      const response = await apiPut<{ data: { user: User } }>('/user/update', data);
      return response.data.user;
    });
  },

  /**
   * id es el id del usuario; roleId, el idDb del rol
   */
  assignRole(id: string, roleId: string): Promise<void> {
    return withContext('asignar rol', async () => {
      await apiPost('/user/assignRole', { id, roleId });
    });
  },

  unassignRole(id: string, roleId: string): Promise<void> {
    return withContext('quitar rol', async () => {
      await apiPost('/user/unassignRole', { id, roleId });
    });
  },
};
