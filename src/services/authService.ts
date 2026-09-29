import { apiGet, apiPost, API_URL, ApiError } from '@/lib/apiClient';
import type { SessionTokens } from '@/lib/tokenUtils';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SessionUser {
  id: string;
  user: string;
  email: string;
  fullName?: string;
}

export interface SessionRole {
  idDb: string;
  id: string;
  name: string;
}

export interface SessionInfo {
  user: SessionUser;
  roles: SessionRole[];
  permissions: string[];
}

export type LoginResponse = SessionTokens & { user: SessionUser };

export const authService = {
  /**
   * Inicia sesión y devuelve el par de tokens
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    let response: Response;
    try {
      response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
    } catch {
      throw new Error('Error de conexión con el servidor');
    }

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      if (response.status === 401) {
        throw new ApiError('Email o contraseña incorrectos', 401, data.code);
      }
      if (response.status === 429) {
        throw new ApiError('Demasiados intentos. Espera unos minutos y vuelve a intentarlo', 429, data.code);
      }
      throw new ApiError(data.error || 'Error al iniciar sesión', response.status, data.code);
    }
    return data;
  },

  /**
   * Usuario autenticado con sus roles y claves de permiso
   */
  getSession(): Promise<SessionInfo> {
    return apiGet<SessionInfo>('/auth/me');
  },

  /**
   * Invalida el refresh token en el servidor
   */
  async logout(): Promise<void> {
    await apiPost('/auth/logout');
  },
};
