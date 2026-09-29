import Layout from "@/components/layout";
import { TypeJobs } from "@/components/general/Settings";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function TypeJobsPage() {
  return (
    <ProtectedRoute requiredPermission="position:read">
      <Layout>
        <TypeJobs />
      </Layout>
    </ProtectedRoute>
  );
}