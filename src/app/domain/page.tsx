import Layout from "@/components/layout";
import { Domain } from "@/components/general/Settings";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function DomainPage() {
  return (
    <ProtectedRoute requiredPermission="domain:read">
      <Layout>
        <Domain />
      </Layout>
    </ProtectedRoute>
  );
}