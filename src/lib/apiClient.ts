import { clearSession, getRefreshToken, getToken, setSession } from './tokenUtils';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface ApiClientOptions extends RequestInit {
  requireAuth?: boolean;
}

type ErrorBody = {
  error?: string;
  message?: string;
  code?: string;
  details?: { path?: (string | number)[]; message: string }[];
};

/**
 * Error de la API con el código y el detalle que devuelve el backend
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: ErrorBody['details'],
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const toApiError = (status: number, body: ErrorBody): ApiError => {
  let message = body.error || body.message || 'Error en la petición';
  if (body.code === 'VALIDATION_ERROR' && body.details?.length) {
    message = body.details.map(detail => detail.message).join('. ');
  } else if (body.code === 'FORBIDDEN') {
    message = 'No tienes permiso para realizar esta acción';
  } else if (status === 429) {
    message = 'Demasiados intentos. Espera unos minutos y vuelve a intentarlo';
  }
  return new ApiError(message, status, body.code, body.details);
};

const redirectToLogin = () => {
  clearSession();
  if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
};

// Un solo refresh a la vez: las peticiones que fallan juntas esperan el mismo
let refreshing: Promise<boolean> | null = null;

export const refreshSession = (): Promise<boolean> => {
  if (!refreshing) {
    refreshing = (async () => {
      const refreshToken = getRefreshToken();
      if (!refreshToken) return false;
      try {
        const response = await fetch(`${API_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });
        if (!response.ok) return false;
        const data = await response.json();
        setSession({ accessToken: data.accessToken, refreshToken: data.refreshToken });
        return true;
      } catch {
        return false;
      }
    })().finally(() => {
      refreshing = null;
    });
  }
  return refreshing;
};

/**
 * Cliente API para hacer peticiones autenticadas.
 * Si el access token venció, renueva la sesión una vez y repite la petición.
 */
export async function apiClient(
  endpoint: string,
  options: ApiClientOptions = {},
  retried = false,
): Promise<Response> {
  const { requireAuth = true, headers = {}, ...fetchOptions } = options;
  const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers as Record<string, string>),
  };
  const token = requireAuth ? getToken() : null;
  if (token) {
    requestHeaders['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...fetchOptions, headers: requestHeaders });

  if (response.status === 401 && requireAuth) {
    if (!retried && await refreshSession()) {
      return apiClient(endpoint, options, true);
    }
    redirectToLogin();
  }

  return response;
}

async function request<T>(endpoint: string, options: ApiClientOptions): Promise<T> {
  const response = await apiClient(endpoint, options);
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw toApiError(response.status, body);
  }
  return body as T;
}

export function apiGet<T = unknown>(endpoint: string, options?: ApiClientOptions): Promise<T> {
  return request<T>(endpoint, { ...options, method: 'GET' });
}

export function apiPost<T = unknown>(endpoint: string, data?: unknown, options?: ApiClientOptions): Promise<T> {
  return request<T>(endpoint, {
    ...options,
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
}

export function apiPut<T = unknown>(endpoint: string, data?: unknown, options?: ApiClientOptions): Promise<T> {
  return request<T>(endpoint, {
    ...options,
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
}

export function apiDelete<T = unknown>(endpoint: string, options?: ApiClientOptions): Promise<T> {
  return request<T>(endpoint, { ...options, method: 'DELETE' });
}
