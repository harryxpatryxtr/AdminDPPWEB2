'use client';

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Multiselect, MultiselectOption } from "@/components/ui/multiselect";
import { X } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { roleService } from "@/services/roleService";
import { permissionService } from "@/services/permissionService";
import { useAuth } from "@/contexts/AuthContext";
import type { Role, RolePermission } from "../../types";
import type { Permission } from "@/components/general/Settings/Permission/types";

interface ModalAssignPermissionsProps {
  role: Role;
  onClose?: () => void;
}

export function ModalAssignPermissions({ role, onClose }: ModalAssignPermissionsProps) {
  const [assigned, setAssigned] = useState<RolePermission[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const loadData = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      setError(null);
      const [allPermissions, rolePermissions] = await Promise.all([
        permissionService.getAllPermissions(),
        roleService.getPermissionsByRole(role._id),
      ]);
      setPermissions(allPermissions);
      setAssigned(rolePermissions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar permisos');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, role._id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Solo se ofrecen los permisos que el rol todavía no tiene
  const assignedIds = new Set(assigned.map(a => a.permission?._id));
  const permissionOptions: MultiselectOption[] = permissions
    .filter(permission => !assignedIds.has(permission._id))
    .map(permission => ({
      value: permission._id,
      label: permission.name,
    }));

  const handleAdd = async () => {
    if (selectedPermissionIds.length === 0) {
      setError('Selecciona al menos un permiso');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      // El backend exige un id único por asignación
      const timestamp = Date.now();
      await Promise.all(selectedPermissionIds.map((permissionId, index) =>
        roleService.setPermission({
          id: `${role.id}-${timestamp}-${index}`,
          permissionId,
          roleId: role._id,
        })
      ));
      setSelectedPermissionIds([]);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al asignar permisos');
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async (assignment: RolePermission) => {
    try {
      setSaving(true);
      setError(null);
      await roleService.removePermission(assignment.id);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al quitar el permiso');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="py-4 text-sm text-muted-foreground">Cargando permisos...</p>;
  }

  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label>Permisos asignados</Label>
        {assigned.length === 0 ? (
          <p className="text-sm text-muted-foreground">Este rol no tiene permisos</p>
        ) : (
          <div className="flex flex-wrap gap-1">
            {assigned.map(assignment => (
              <span
                key={assignment.id}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs"
              >
                {assignment.permission?.name ?? 'Permiso eliminado'}
                <button
                  type="button"
                  onClick={() => handleRemove(assignment)}
                  disabled={saving}
                  aria-label={`Quitar ${assignment.permission?.name ?? 'permiso'}`}
                  className="hover:text-blue-950 disabled:opacity-50"
                >
                  <X className="size-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="permissions">Agregar permisos</Label>
        <Multiselect
          options={permissionOptions}
          value={selectedPermissionIds}
          onChange={setSelectedPermissionIds}
          placeholder={permissionOptions.length ? "Selecciona uno o más permisos" : "No hay más permisos disponibles"}
          disabled={saving || permissionOptions.length === 0}
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={saving}
        >
          Cerrar
        </Button>
        <Button type="button" onClick={handleAdd} disabled={saving || selectedPermissionIds.length === 0}>
          {saving ? 'Guardando...' : 'Agregar'}
        </Button>
      </div>
    </div>
  );
}
