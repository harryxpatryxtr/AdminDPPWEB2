// Tipos y helpers compartidos por los catálogos de configuración.
// Reflejan la forma en que el backend (Admin-Back-Adm) devuelve los documentos de Mongo.

export type AuditUser = {
  _id: string;
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
} | null;

export type CatalogItem = {
  _id: string;
  id: string;
  name: string;
  description: string;
  state: number; // 1: activo, 0: inactivo
  userCreated?: AuditUser;
  userUpdate?: AuditUser;
  createdAt?: string;
  updatedAt?: string;
};

export const authorName = (user?: AuditUser): string => {
  if (!user) return '-';
  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
  return fullName || user.username || user.email || '-';
};

export const formatDate = (date?: string): string => {
  if (!date) return '-';
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return date;
  return dateObj.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

export function StateBadge({ state }: { state: number }) {
  const active = state === 1;
  return (
    <span className={`px-2 py-1 rounded-full text-xs ${
      active
        ? 'bg-green-100 text-green-800'
        : 'bg-gray-100 text-gray-800'
    }`}>
      {active ? 'Activo' : 'Inactivo'}
    </span>
  );
}
