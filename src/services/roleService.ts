import connectDB from '@/lib/mongodb';
import Role from '@/models/Role';

export const getAllRoles = async () => {
  await connectDB();
  return Role.find({});
};

export const createRole = async (roleData: { name: string; permissions: string[] }) => {
  await connectDB();
  const role = new Role(roleData);
  return role.save();
};

export const getRoleById = async (roleId: string) => {
  await connectDB();
  return Role.findById(roleId);
};

export const updateRole = async (roleId: string, updateData: Partial<{ name: string; permissions: string[] }>) => {
  await connectDB();
  return Role.findByIdAndUpdate(roleId, updateData, { new: true });
};

export const deleteRole = async (roleId: string) => {
  await connectDB();
  return Role.findByIdAndDelete(roleId);
};
