'use client';
import Layout from "@/components/layout";
import { DataTable } from "@/components/general";
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { redirect } from 'next/navigation'
  
const data = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Doe" },
  { id: 3, name: "John Smith" },
];

const columns = [
  { id: "name", header: "Name" },
  { id: "email", header: "Email" },
  { id: "phone", header: "Phone" },
];

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

