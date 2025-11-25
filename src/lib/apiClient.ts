import { getToken } from './tokenUtils';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://admin-back-adm-production.up.railway.app/api';

export interface ApiClientOptions extends RequestInit {
  requireAuth?: boolean;
}

/**
 * Cliente API para hacer peticiones autenticadas
 */
export async function apiClient(
  endpoint: string,
  options: ApiClientOptions = {}
): Promise<Response> {
  const { requireAuth = true, headers = {}, ...fetchOptions } = options;

  const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;

  const requestHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...headers,
  };

  // Agregar token de autenticación si es requerido
  if (requireAuth) {
    const token = getToken();
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers: requestHeaders,
  });

  return response;
}

/**
 * Helper para hacer peticiones GET
 */
export async function apiGet<T = any>(
  endpoint: string,
  options?: ApiClientOptions
): Promise<T> {
  const response = await apiClient(endpoint, {
    ...options,
    method: 'GET',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error en la petición' }));
    throw new Error(error.message || 'Error en la petición');
  }

  return response.json();
}

/**
 * Helper para hacer peticiones POST
 */
export async function apiPost<T = any>(
  endpoint: string,
  data?: any,
  options?: ApiClientOptions
): Promise<T> {
  const response = await apiClient(endpoint, {
    ...options,
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error en la petición' }));
    throw new Error(error.message || 'Error en la petición');
  }

  return response.json();
}

/**
 * Helper para hacer peticiones PUT
 */
export async function apiPut<T = any>(
  endpoint: string,
  data?: any,
  options?: ApiClientOptions
): Promise<T> {
  const response = await apiClient(endpoint, {
    ...options,
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error en la petición' }));
    throw new Error(error.message || 'Error en la petición');
  }

  return response.json();
}

/**
 * Helper para hacer peticiones DELETE
 */
export async function apiDelete<T = any>(
  endpoint: string,
  options?: ApiClientOptions
): Promise<T> {
  const response = await apiClient(endpoint, {
    ...options,
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error en la petición' }));
    throw new Error(error.message || 'Error en la petición');
  }

  return response.json();
}

