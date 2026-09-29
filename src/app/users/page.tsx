import Layout from "@/components/layout";
import { User } from "@/components/general/Settings/User";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function UsersPage() {
  return (
    <ProtectedRoute>
      <Layout>
        <User />
      </Layout>
    </ProtectedRoute>
  );
}
