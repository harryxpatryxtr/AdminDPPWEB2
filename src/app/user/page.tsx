'use client';
import Layout from "@/components/layout";
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';


export default function UserPage() {
  const { user, loading } = useAuth();

  return (
    <ProtectedRoute>
      <Layout>
        <h1 className="text-2xl font-bold">Usuario Page</h1>
        {user && (
          <div className="mt-4">
            <p>Bienvenido, {user.email}</p>
          </div>
        )}
      </Layout>
    </ProtectedRoute>
  );
}

