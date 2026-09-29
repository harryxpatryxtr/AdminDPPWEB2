'use client';
import { useEffect, useState } from "react";
import { roleService } from "@/services/roleService";
import type { Role } from "../../Role/types";

// Roles activos para los selects del formulario de usuario
export const useRoles = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [rolesError, setRolesError] = useState<string | null>(null);

  useEffect(() => {
    roleService.getAllRoles()
      .then(setRoles)
      .catch(err => setRolesError(err instanceof Error ? err.message : 'Error al cargar roles'))
      .finally(() => setLoadingRoles(false));
  }, []);

  return { roles, loadingRoles, rolesError };
};
