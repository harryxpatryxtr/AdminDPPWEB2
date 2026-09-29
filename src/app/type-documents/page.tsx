import Layout from "@/components/layout";
import { TypeDocuments } from "@/components/general/Settings";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function TypeDocumentsPage() {
  return (
    <ProtectedRoute requiredPermission="document-type:read">
      <Layout>
        <TypeDocuments />
      </Layout>
    </ProtectedRoute>
  );
}