import Layout from "@/components/layout";
import { Permission } from "@/components/general/Settings/Permission";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function PermissionsPage() {
  return (
    <ProtectedRoute requiredPermission="permission:read">
      <Layout>
        <Permission />
      </Layout>
    </ProtectedRoute>
  );
}

