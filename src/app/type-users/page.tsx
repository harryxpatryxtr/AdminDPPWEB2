import Layout from "@/components/layout";
import { TypeUsers } from "@/components/general/Settings";
import ProtectedRoute from "@/components/ProtectedRoute";

  export default function TypeUsersPage() {
  return (
    <ProtectedRoute>
      <Layout>
        <TypeUsers />
      </Layout>
    </ProtectedRoute>
  );
}