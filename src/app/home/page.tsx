'use client';
import Layout from "@/components/layout";
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';


export default function HomePage() {
  const { user, roles } = useAuth();

  return (
    <ProtectedRoute>
      <Layout>
        <h1 className="text-2xl font-bold">Inicio</h1>
        {user && (
          <div className="mt-4">
            <p>Bienvenido, {user.fullName || user.user || user.email}</p>
            <p className="text-sm text-muted-foreground">
              {roles.length ? `Rol: ${roles.map(role => role.name).join(', ')}` : 'Sin rol asignado'}
            </p>
          </div>
        )}
      </Layout>
    </ProtectedRoute>
  );
}

