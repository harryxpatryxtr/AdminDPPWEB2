// Tipos y helpers compartidos por los catálogos de configuración.
// Reflejan la forma en que el backend (Admin-Back-Adm) devuelve los documentos de Mongo.

export type CatalogItem = {
  idDb: string; // _id de Mongo
  id: string;
  name: string;
  description: string;
  state: number; // 1: activo, 0: inactivo
  createdAt?: string;
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
