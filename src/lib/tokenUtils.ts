/**
 * Utilidades para manejar la sesión JWT en el cliente.
 *
 * El backend emite un access token corto (15 min) y un refresh token largo (7 días).
 * La cookie guarda el refresh token porque el middleware de Next solo la usa para
 * saber si hay una sesión vigente; las peticiones usan el access token.
 */

const ACCESS_TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';
const COOKIE_NAME = process.env.NEXT_PUBLIC_JWT_COOKIE_NAME || 'auth_token';

export interface SessionTokens {
  accessToken: string;
  refreshToken: string;
}

const isBrowser = () => typeof window !== 'undefined';

export const setSession = ({ accessToken, refreshToken }: SessionTokens): void => {
  if (!isBrowser()) return;
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);

  const expires = getTokenExpiration(refreshToken);
  const expiresAttr = expires ? `; expires=${expires.toUTCString()}` : '';
  document.cookie = `${COOKIE_NAME}=${refreshToken}${expiresAttr}; path=/; SameSite=Lax`;
};

export const getToken = (): string | null =>
  isBrowser() ? localStorage.getItem(ACCESS_TOKEN_KEY) : null;

export const getRefreshToken = (): string | null =>
  isBrowser() ? localStorage.getItem(REFRESH_TOKEN_KEY) : null;

export const clearSession = (): void => {
  if (!isBrowser()) return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  // Datos de la versión anterior de la sesión
  localStorage.removeItem('auth_user');
  document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

/**
 * Decodifica el payload del JWT (sin verificar la firma)
 */
export const decodeToken = (token: string): { exp?: number } | null => {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
};

const getTokenExpiration = (token: string): Date | null => {
  const exp = decodeToken(token)?.exp;
  return exp ? new Date(exp * 1000) : null;
};

export const isTokenExpired = (token: string): boolean => {
  const expiration = getTokenExpiration(token);
  return !expiration || Date.now() >= expiration.getTime();
};

/**
 * Hay sesión mientras el refresh token siga vigente
 */
export const hasSession = (): boolean => {
  const refreshToken = getRefreshToken();
  return refreshToken !== null && !isTokenExpired(refreshToken);
};
