import { getToken, removeToken } from './tokenUtils';

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

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers as Record<string, string>),
  };

  // Agregar token de autenticación si es requerido
  if (requireAuth) {
    const token = getToken();
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
      // Debug: verificar que el token se está enviando (solo en desarrollo)
      if (process.env.NODE_ENV === 'development') {
        console.log('🔐 Token JWT agregado al header Authorization', {
          endpoint,
          method: fetchOptions.method || 'GET',
          tokenLength: token.length,
          tokenPreview: token.substring(0, 20) + '...'
        });
      }
    } else {
      console.warn('⚠️ No se encontró token JWT para la petición autenticada', { endpoint });
    }
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers: requestHeaders,
  });

  // Si la respuesta es 401 o 403, el token puede ser inválido o haber expirado
  if (response.status === 401 || response.status === 403) {
    const errorData = await response.json().catch(() => ({}));
    if (errorData.error === 'Invalid token' || errorData.message?.includes('token')) {
      // Limpiar token inválido
      if (typeof window !== 'undefined') {
        removeToken();
        // Redirigir al login si estamos en el cliente
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
  }

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
    const error = await response.json().catch(() => ({ message: 'Error en la petición', error: 'Unknown error' }));
    
    // Manejar errores de autenticación específicamente
    if (response.status === 401 || response.status === 403) {
      if (error.error === 'Invalid token' || error.message?.includes('token')) {
        throw new Error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
      }
    }
    
    throw new Error(error.message || error.error || 'Error en la petición');
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
    const error = await response.json().catch(() => ({ message: 'Error en la petición', error: 'Unknown error' }));
    
    // Manejar errores de autenticación específicamente
    if (response.status === 401 || response.status === 403) {
      if (error.error === 'Invalid token' || error.message?.includes('token')) {
        throw new Error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
      }
    }
    
    throw new Error(error.message || error.error || 'Error en la petición');
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
    const error = await response.json().catch(() => ({ message: 'Error en la petición', error: 'Unknown error' }));
    
    // Manejar errores de autenticación específicamente
    if (response.status === 401 || response.status === 403) {
      if (error.error === 'Invalid token' || error.message?.includes('token')) {
        throw new Error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
      }
    }
    
    throw new Error(error.message || error.error || 'Error en la petición');
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
    const error = await response.json().catch(() => ({ message: 'Error en la petición', error: 'Unknown error' }));
    
    // Manejar errores de autenticación específicamente
    if (response.status === 401 || response.status === 403) {
      if (error.error === 'Invalid token' || error.message?.includes('token')) {
        throw new Error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
      }
    }
    
    throw new Error(error.message || error.error || 'Error en la petición');
  }

  return response.json();
}

