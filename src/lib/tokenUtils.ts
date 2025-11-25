/**
 * Utilidades para manejar tokens JWT en el cliente
 */

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';
const COOKIE_NAME = process.env.NEXT_PUBLIC_JWT_COOKIE_NAME || 'auth_token';
const COOKIE_MAX_AGE = parseInt(process.env.NEXT_PUBLIC_JWT_COOKIE_MAX_AGE || '2592000', 10); // 30 días por defecto

export interface StoredUser {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

/**
 * Guarda el token JWT en localStorage y cookies
 */
export const setToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    // Guardar en localStorage
    localStorage.setItem(TOKEN_KEY, token);
    
    // Guardar en cookie para que el middleware pueda acceder
    const expires = new Date();
    expires.setTime(expires.getTime() + COOKIE_MAX_AGE * 1000);
    document.cookie = `${COOKIE_NAME}=${token}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
  }
};

/**
 * Obtiene el token JWT de localStorage
 */
export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

/**
 * Elimina el token JWT de localStorage y cookies
 */
export const removeToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    
    // Eliminar cookie
    document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
};

/**
 * Guarda información del usuario en localStorage
 */
export const setUser = (user: StoredUser): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

/**
 * Obtiene información del usuario de localStorage
 */
export const getUser = (): StoredUser | null => {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem(USER_KEY);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        return null;
      }
    }
  }
  return null;
};

/**
 * Verifica si hay un token almacenado
 */
export const isAuthenticated = (): boolean => {
  return getToken() !== null;
};

/**
 * Decodifica el payload del JWT (sin verificar la firma)
 * Útil para obtener información básica del token
 */
export const decodeToken = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

/**
 * Verifica si el token ha expirado
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) {
      return true;
    }
    const expirationTime = decoded.exp * 1000; // Convertir a milisegundos
    return Date.now() >= expirationTime;
  } catch (error) {
    return true;
  }
};

