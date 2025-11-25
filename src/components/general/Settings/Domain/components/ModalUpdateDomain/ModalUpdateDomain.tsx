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
import { domainService } from "@/services/domainService";
import { useAuth } from "@/contexts/AuthContext";
import type { Domain } from "../../types";

interface ModalUpdateDomainProps {
  domain: Domain;
  onSuccess?: () => void;
  onClose?: () => void;
}

export function ModalUpdateDomain({ domain, onSuccess, onClose }: ModalUpdateDomainProps) {
  const [description, setDescription] = useState(domain.description || '');
  const [status, setStatus] = useState(domain.state || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    setDescription(domain.description || '');
    setStatus(domain.state || '');
  }, [domain]);

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
      setError('Debes estar autenticado para actualizar un dominio');
      return;
    }

    try {
      setLoading(true);
      await domainService.updateDomain({
        id: domain.id,
        description: description.trim(),
        name: domain.name,
        // state: status,
      });
      onSuccess?.();
      onClose?.();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar el dominio';
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
          value={domain.id}
          disabled
          className="bg-gray-50 cursor-not-allowed"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="domain">Dominio</Label>
        <Input
          id="domain"
          value={domain.name}
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
          placeholder="Descripción del dominio"
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

