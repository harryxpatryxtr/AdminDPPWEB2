'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { permissionService } from "@/services/permissionService";
import { useAuth } from "@/contexts/AuthContext";
import type { Permission } from "../../types";

interface ModalUpdatePermissionProps {
  permission: Permission;
  onSuccess?: () => void;
  onClose?: () => void;
}

export function ModalUpdatePermission({ permission, onSuccess, onClose }: ModalUpdatePermissionProps) {
  const [description, setDescription] = useState(permission.description || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    setDescription(permission.description || '');
  }, [permission]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!description.trim()) {
      setError('La descripción es requerida');
      return;
    }

    if (!isAuthenticated) {
      setError('Debes estar autenticado para actualizar un permiso');
      return;
    }

    try {
      setLoading(true);
      await permissionService.updatePermission({
        id: permission.id,
        description: description.trim(),
        name: permission.name,
      });
      onSuccess?.();
      onClose?.();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar el permiso';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="id">Código</Label>
        <Input
          id="id"
          value={permission.id}
          disabled
          className="bg-gray-50 cursor-not-allowed"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Permiso</Label>
        <Input
          id="name"
          value={permission.name}
          disabled
          className="bg-gray-50 cursor-not-allowed"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción *</Label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descripción del permiso"
          required
          disabled={loading}
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
        <Button type="submit" disabled={loading}>
          {loading ? 'Actualizando...' : 'Actualizar'}
        </Button>
      </div>
    </form>
  );
}

