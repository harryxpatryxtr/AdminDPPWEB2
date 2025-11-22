'use client';
import Layout from "@/components/layout";
<<<<<<< HEAD
=======
import { DataTable } from "@/components/general";
import { useSession, signOut } from 'next-auth/react'
import { redirect } from 'next/navigation'

  
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
>>>>>>> 2391840 (Login Gogle terminado)

export default function UserPage() {

const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login')
    },
  })
  return (
    <Layout>
      <h1 className="text-2xl font-bold">Usuario Page</h1>
    </Layout>
  );
}

