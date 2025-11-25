import { NextRequest } from 'next/server';

/**
 * Decodifica el payload del JWT (sin verificar la firma)
 */
function decodeToken(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      Buffer.from(base64, 'base64')
        .toString()
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
}

/**
 * Verifica si el token ha expirado
 */
function isTokenExpired(token: string): boolean {
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
}

/**
 * Obtiene el token JWT de las cookies o headers
 */
export function getTokenFromRequest(request: NextRequest): string | null {
  // Intentar obtener de cookies primero
  const tokenFromCookie = request.cookies.get('auth_token')?.value;
  if (tokenFromCookie) {
    return tokenFromCookie;
  }

  // Intentar obtener del header Authorization
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  return null;
}

/**
 * Verifica si el request tiene un token válido
 */
export function isAuthenticatedRequest(request: NextRequest): boolean {
  const token = getTokenFromRequest(request);
  if (!token) {
    return false;
  }

  // Verificar si el token ha expirado
  if (isTokenExpired(token)) {
    return false;
  }

  return true;
}

/**
 * Obtiene información del usuario del token
 */
export function getUserFromToken(request: NextRequest): any {
  const token = getTokenFromRequest(request);
  if (!token) {
    return null;
  }

  try {
    return decodeToken(token);
  } catch (error) {
    return null;
  }
}

