'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** Clave de permiso necesaria para ver la página (ej. "user:read") */
  requiredPermission?: string;
}

/**
 * Protege rutas en el cliente: redirige al login sin sesión y
 * muestra un aviso si falta el permiso requerido
 */
export default function ProtectedRoute({ children, requiredPermission }: ProtectedRouteProps) {
  const { isAuthenticated, loading, can } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requiredPermission && !can(requiredPermission)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-sm">
          <p className="text-lg font-semibold">Sin acceso</p>
          <p className="mt-2 text-gray-600">No tienes permiso para ver esta sección.</p>
          <button className="mt-4 underline" onClick={() => router.push('/home')}>Ir al inicio</button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
