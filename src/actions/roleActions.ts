'use server'
import { revalidatePath } from 'next/cache';
import Role from '../models/Role';

import {
  createRole as createRoleService,
  deleteRole as deleteRoleService,
  getAllRoles as getAllRolesService,
  getRoleById as getRoleByIdService,
  updateRole as updateRoleService,
} from '../services/roleService';

export const getAllRoles = async (): Promise<typeof Role[]> => {
  return getAllRolesService();
};

export const createRole = async (roleData: { name: string; permissions: string[] }): Promise< typeof Role> => {
  const newRole = await createRoleService(roleData);
  revalidatePath('/roles');
  return newRole;
};

export const getRoleById = async (roleId: string): Promise< typeof Role | null> => {
  return getRoleByIdService(roleId);
};

export const updateRole = async (
  roleId: string,
  updateData: Partial<{ name: string; permissions: string[] }>
): Promise<typeof Role | null> => {
  const updatedRole = await updateRoleService(roleId, updateData);
  revalidatePath('/roles');
  return updatedRole;
};

export const deleteRole = async (roleId: string): Promise<typeof Role | null> => {
  const deletedRole = await deleteRoleService(roleId);
  revalidatePath('/roles');
  return deletedRole;
};  


