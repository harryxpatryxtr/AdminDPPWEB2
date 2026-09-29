export type UserRole = {
  _id: string;
  id: string;
  name: string;
} | null;

export type User = {
  _id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  role: UserRole;
  isActive: boolean;
  createdAt?: string;
};
