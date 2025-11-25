'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { userTypeService } from "@/services/userTypeService";
import { useAuth } from "@/contexts/AuthContext";
import type { TypeUsers } from "../../types";

interface ModalUpdateTypeUserProps {
  typeUser: TypeUsers;
  onSuccess?: () => void;
  onClose?: () => void;
}

export function ModalUpdateTypeUser({ typeUser, onSuccess, onClose }: ModalUpdateTypeUserProps) {
  const [description, setDescription] = useState(typeUser.description || '');
  const [status, setStatus] = useState(typeUser.state || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    setDescription(typeUser.description || '');
    setStatus(typeUser.state || '');
  }, [typeUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!description.trim()) {
      setError('La descripción es requerida');
      return;
    }

    if (!status) {
      setError('El estado es requerido');
      return;
    }

    if (!isAuthenticated) {
      setError('Debes estar autenticado para actualizar un tipo de usuario');
      return;
    }

    try {
      setLoading(true);
      await userTypeService.updateUserType({
        id: typeUser.id,
        description: description.trim(),
        name: typeUser.name,
        // state: status,
      });
      onSuccess?.();
      onClose?.();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar el tipo de usuario';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="id">ID</Label>
        <Input
          id="id"
          value={typeUser.id}
          disabled
          className="bg-gray-50 cursor-not-allowed"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Tipo de Usuario</Label>
        <Input
          id="name"
          value={typeUser.name}
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
          placeholder="Descripción del tipo de usuario"
          required
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Estado *</Label>
        <Select
          value={status}
          onValueChange={setStatus}
          disabled={loading}
        >
          <SelectTrigger id="status" className="w-full">
            <SelectValue placeholder="Selecciona un estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Activo</SelectItem>
            <SelectItem value="inactive">Inactivo</SelectItem>
          </SelectContent>
        </Select>
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

