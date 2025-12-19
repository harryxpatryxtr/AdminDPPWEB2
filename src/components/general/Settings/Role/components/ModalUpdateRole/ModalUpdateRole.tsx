'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { roleService } from "@/services/roleService";
import { useAuth } from "@/contexts/AuthContext";
import type { Role } from "../../types";

interface ModalUpdateRoleProps {
  role: Role;
  onSuccess?: () => void;
  onClose?: () => void;
}

export function ModalUpdateRole({ role, onSuccess, onClose }: ModalUpdateRoleProps) {
  const [description, setDescription] = useState(role.description || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    setDescription(role.description || '');
  }, [role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!description.trim()) {
      setError('La descripción es requerida');
      return;
    }

    if (!isAuthenticated) {
      setError('Debes estar autenticado para actualizar un rol');
      return;
    }

    try {
      setLoading(true);
      await roleService.updateRole({
        id: role.id,
        name: role.name,
        description: description.trim(),
      });
      onSuccess?.();
      onClose?.();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar el rol';
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
          value={role.id}
          disabled
          className="bg-gray-50 cursor-not-allowed"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Rol</Label>
        <Input
          id="name"
          value={role.name}
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
          placeholder="Descripción del rol"
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

