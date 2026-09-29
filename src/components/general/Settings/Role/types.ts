import type { CatalogItem } from '../common';

// Asignación rol-permiso tal como la devuelve /role/getPermissions/:roleId
export type RolePermission = {
  idDb: string;
  id: string;
  role: string;
  permission: { _id: string; id: string; name: string; description?: string } | null;
  state: number;
};

export type Role = CatalogItem & {
  permissions?: RolePermission[];
};
