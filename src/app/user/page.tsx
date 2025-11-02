import Layout from "@/components/layout";
import { DataTable } from "@/components/general";

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
  return (
    <Layout>
      <h1 className="text-2xl font-bold">Usuario Page</h1>
      <DataTable data={data} columns={columns} />
    </Layout>
  );
}

