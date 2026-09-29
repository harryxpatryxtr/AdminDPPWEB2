// Catálogo poblado dentro del usuario
export type CatalogRef = {
  _id: string;
  id: string;
  name: string;
} | null;

export type UserRoleRef = {
  idDb: string;
  id: string;
  name: string;
};

export type Sex = 'Male' | 'Female' | 'Other';

export type User = {
  idDb: string;
  id: string;
  user: string;
  email: string;
  firstName?: string;
  paternalSurname?: string;
  maternalSurname?: string;
  fullName?: string;
  sex?: Sex | null;
  cellphone?: string;
  documentNumber?: string;
  idTypeUser?: CatalogRef;
  idTypeDocument?: CatalogRef;
  idTypeCargo?: CatalogRef;
  roles: UserRoleRef[];
  state: number; // 1: activo, 0: inactivo
  createdAt?: string;
};
