import type { CatalogItem } from '../common';
import type { Permission } from '../Permission/types';

// Asignación rol-permiso tal como la devuelve /role/getPermissions/:roleId
export type RolePermission = {
  _id: string;
  id: string;
  role: string;
  permission: Permission | null;
  state: number;
};

export type Role = CatalogItem & {
  permissions?: RolePermission[];
};
