'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { permissionService } from "@/services/permissionService";
import { useAuth } from "@/contexts/AuthContext";

interface ModalCreatePermissionProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

export function ModalCreatePermission({ onSuccess, onClose }: ModalCreatePermissionProps) {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!id.trim() || !name.trim() || !description.trim()) {
      setError('Por favor, completa todos los campos');
      return;
    }

    if (!isAuthenticated) {
      setError('Debes estar autenticado para crear un permiso');
      return;
    }

    try {
      setLoading(true);
      await permissionService.createPermission({
        id: id.trim(),
        name: name.trim(),
        description: description.trim(),
      });
      
      // Limpiar formulario
      setId('');
      setName('');
      setDescription('');
      
      // Llamar callbacks
      onSuccess?.();
      onClose?.();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear el permiso';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="id">ID *</Label>
        <Input
          id="id"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="Ej: PER001"
          required
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Permiso *</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej: crear_usuario"
          required
          disabled={loading}
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
          {loading ? 'Creando...' : 'Crear'}
        </Button>
      </div>
    </form>
  );
}

