'use client';
import Layout from "@/components/layout";
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';


export default function HomePage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <Layout>
        <h1 className="text-2xl font-bold">Inicio</h1>
        {user && (
          <div className="mt-4">
            <p>Bienvenido, {user.name || user.email}</p>
            {user.role && <p className="text-sm text-muted-foreground">Rol: {user.role}</p>}
          </div>
        )}
      </Layout>
    </ProtectedRoute>
  );
}

