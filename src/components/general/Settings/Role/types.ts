export type Role = {
  id: string;
  name: string;
  description: string;
  permissions?: string[] | { id: string; name: string }[];
  author: string;
  date: string;
  state: string;
};

