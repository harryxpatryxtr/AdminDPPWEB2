import Layout from "@/components/layout";
import { TypeUsers } from "@/components/general/Settings";
import ProtectedRoute from "@/components/ProtectedRoute";

  export default function TypeUsersPage() {
  return (
    <ProtectedRoute requiredPermission="user-type:read">
      <Layout>
        <TypeUsers />
      </Layout>
    </ProtectedRoute>
  );
}