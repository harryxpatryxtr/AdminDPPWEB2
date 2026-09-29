import Layout from "@/components/layout";
import { Role } from "@/components/general/Settings/Role";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function RolesPage() {
  return (
    <ProtectedRoute requiredPermission="role:read">
      <Layout>
        <Role />
      </Layout>
    </ProtectedRoute>
  );
}

