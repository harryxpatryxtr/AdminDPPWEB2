'use client';

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Multiselect, MultiselectOption } from "@/components/ui/multiselect";
import { useState, useEffect } from "react";
import { roleService } from "@/services/roleService";
import { permissionService } from "@/services/permissionService";
import { useAuth } from "@/contexts/AuthContext";
import { getToken, isTokenExpired } from "@/lib/tokenUtils";
import { useRouter } from "next/navigation";
import type { Role } from "../../types";
import type { Permission } from "@/components/general/Settings/Permission/types";

interface ModalAssignPermissionsProps {
  roles: Role[];
  onSuccess?: () => void;
  onClose?: () => void;
}

export function ModalAssignPermissions({ roles, onSuccess, onClose }: ModalAssignPermissionsProps) {
  const [selectedRoleId, setSelectedRoleId] = useState<string>('');
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingPermissions, setLoadingPermissions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // Cargar permisos al abrir el modal
  useEffect(() => {
    const fetchPermissions = async () => {
      if (!isAuthenticated) return;

      try {
        setLoadingPermissions(true);
        const data = await permissionService.getAllPermissions();
        setPermissions(data);
      } catch (err) {
        console.error('Error fetching permissions:', err);
      } finally {
        setLoadingPermissions(false);
      }
    };

    fetchPermissions();
  }, [isAuthenticated]);

  const permissionOptions: MultiselectOption[] = permissions.map(permission => ({
    value: permission.id,
    label: permission.name,
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedRoleId) {
      setError('Por favor, selecciona un rol');
      return;
    }

    if (selectedPermissionIds.length === 0) {
      setError('Por favor, selecciona al menos un permiso');
      return;
    }

    if (!isAuthenticated) {
      setError('Debes estar autenticado para asignar permisos');
      return;
    }

    // Verificar que el token existe y no ha expirado
    const token = getToken();
    if (!token) {
      setError('No se encontró token de autenticación. Por favor, inicia sesión nuevamente.');
      router.push('/login');
      return;
    }

    if (isTokenExpired(token)) {
      setError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
      router.push('/login');
      return;
    }

    try {
      setLoading(true);
      
      // Asignar cada permiso individualmente
      // El servicio requiere un id único para cada asignación
      // Usaremos un timestamp o índice como id
      const timestamp = Date.now();
      const assignments = selectedPermissionIds.map((permissionId, index) => {
        return roleService.setPermission({
          id: `${timestamp}-${index}`, // Generar un id único
          permissionId: permissionId,
          roleId: selectedRoleId,
        });
      });

      // Esperar a que todas las asignaciones se completen
      await Promise.all(assignments);
      
      // Limpiar formulario
      setSelectedRoleId('');
      setSelectedPermissionIds([]);
      
      // Llamar callbacks
      onSuccess?.();
      onClose?.();
    } catch (err) {
      let errorMessage = 'Error al asignar permisos';
      
      if (err instanceof Error) {
        errorMessage = err.message;
        
        // Si el error es de token inválido, redirigir al login
        if (errorMessage.includes('sesión ha expirado') || errorMessage.includes('Invalid token')) {
          setTimeout(() => {
            router.push('/login');
          }, 2000);
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="role">Rol *</Label>
        <Select
          value={selectedRoleId}
          onValueChange={setSelectedRoleId}
          disabled={loading || loadingPermissions}
        >
          <SelectTrigger id="role" className="w-full">
            <SelectValue placeholder="Selecciona un rol" />
          </SelectTrigger>
          <SelectContent>
            {roles.map((role) => (
              <SelectItem key={role.id} value={role.id}>
                {role.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="permissions">Permisos *</Label>
        <Multiselect
          options={permissionOptions}
          value={selectedPermissionIds}
          onChange={setSelectedPermissionIds}
          placeholder="Selecciona uno o más permisos"
          disabled={loading || loadingPermissions}
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
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={loading || loadingPermissions}>
          {loading ? 'Asignando...' : 'Asignar'}
        </Button>
      </div>
    </form>
  );
}

