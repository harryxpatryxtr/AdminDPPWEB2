import Layout from "@/components/layout";
import { Role } from "@/components/general/Settings/Role";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function RolesPage() {
  return (
    <ProtectedRoute>
      <Layout>
        <Role />
      </Layout>
    </ProtectedRoute>
  );
}

