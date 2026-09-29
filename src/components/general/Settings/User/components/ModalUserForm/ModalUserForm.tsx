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
import { Multiselect } from "@/components/ui/multiselect";
import { useState } from "react";
import { userService, UserProfile } from "@/services/userService";
import { useAuth } from "@/contexts/AuthContext";
import { useUserCatalogs } from "../../hooks";
import type { Sex, User } from "../../types";
import type { CatalogItem } from "../../../common";

const NONE = "none";
const MIN_PASSWORD = 12;

interface ModalUserFormProps {
  /** Usuario a editar; sin él, el formulario crea uno nuevo */
  user?: User;
  onSuccess?: () => void;
  onClose?: () => void;
}

function CatalogSelect({ id, label, value, onChange, options, disabled }: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: CatalogItem[];
  disabled?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger id={id} className="w-full">
          <SelectValue placeholder="Sin asignar" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={NONE}>Sin asignar</SelectItem>
          {options.map(option => (
            <SelectItem key={option.idDb} value={option.idDb}>{option.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function ModalUserForm({ user, onSuccess, onClose }: ModalUserFormProps) {
  const isEdit = Boolean(user);
  const { can, user: sessionUser } = useAuth();
  const canAssignRoles = can('user:assign-role');
  const { roles, userTypes, documentTypes, positions, loadingCatalogs } = useUserCatalogs();

  const [form, setForm] = useState({
    firstName: user?.firstName ?? '',
    paternalSurname: user?.paternalSurname ?? '',
    maternalSurname: user?.maternalSurname ?? '',
    user: user?.user ?? '',
    email: user?.email ?? '',
    password: '',
    cellphone: user?.cellphone ?? '',
    documentNumber: user?.documentNumber ?? '',
    sex: user?.sex ?? NONE,
    idTypeUser: user?.idTypeUser?._id ?? NONE,
    idTypeDocument: user?.idTypeDocument?._id ?? NONE,
    idTypeCargo: user?.idTypeCargo?._id ?? NONE,
    state: String(user?.state ?? 1),
  });
  const initialRoleIds = user?.roles.map(role => String(role.idDb)) ?? [];
  const [roleIds, setRoleIds] = useState<string[]>(initialRoleIds);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Usuario creado cuya asignación de roles falló: ya no se puede reenviar la creación
  const [createdWithErrors, setCreatedWithErrors] = useState(false);

  const set = (field: keyof typeof form) => (value: string) =>
    setForm(prev => ({ ...prev, [field]: value }));
  const onInput = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    set(field)(e.target.value);
  const orNull = (value: string) => (value === NONE ? null : value);
  const isSelf = isEdit && sessionUser?.id === user?.id;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.user.trim() || !form.email.trim()) {
      setError('Usuario y email son obligatorios');
      return;
    }
    if ((!isEdit || form.password) && form.password.length < MIN_PASSWORD) {
      setError(`La contraseña debe tener al menos ${MIN_PASSWORD} caracteres`);
      return;
    }

    const profile: UserProfile = {
      firstName: form.firstName.trim(),
      paternalSurname: form.paternalSurname.trim(),
      maternalSurname: form.maternalSurname.trim(),
      cellphone: form.cellphone.trim(),
      documentNumber: form.documentNumber.trim(),
      sex: orNull(form.sex) as Sex | null,
      idTypeUser: orNull(form.idTypeUser),
      idTypeDocument: orNull(form.idTypeDocument),
      idTypeCargo: orNull(form.idTypeCargo),
    };

    let saved: User | undefined;
    try {
      setLoading(true);
      saved = isEdit
        ? await userService.updateUser({
            id: user!.id,
            ...profile,
            user: form.user.trim(),
            email: form.email.trim(),
            state: Number(form.state) as 0 | 1,
            // Solo se envía si se quiere cambiar
            ...(form.password && { password: form.password }),
          })
        : await userService.createUser({
            ...profile,
            user: form.user.trim(),
            email: form.email.trim(),
            password: form.password,
          });

      if (canAssignRoles) {
        const toAssign = roleIds.filter(id => !initialRoleIds.includes(id));
        const toRemove = initialRoleIds.filter(id => !roleIds.includes(id));
        for (const roleId of toAssign) await userService.assignRole(saved.id, roleId);
        for (const roleId of toRemove) await userService.unassignRole(saved.id, roleId);
      }

      onSuccess?.();
      onClose?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al guardar el usuario';
      if (!isEdit && saved) {
        setCreatedWithErrors(true);
        setError(`El usuario se creó, pero ${message}. Edítalo para completar sus roles.`);
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const busy = loading || loadingCatalogs;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4 max-h-[70vh] overflow-y-auto px-1">
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Nombres</Label>
          <Input id="firstName" value={form.firstName} onChange={onInput('firstName')} disabled={loading} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="paternalSurname">Apellido paterno</Label>
          <Input id="paternalSurname" value={form.paternalSurname} onChange={onInput('paternalSurname')} disabled={loading} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="maternalSurname">Apellido materno</Label>
          <Input id="maternalSurname" value={form.maternalSurname} onChange={onInput('maternalSurname')} disabled={loading} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="user">Usuario *</Label>
          <Input id="user" value={form.user} onChange={onInput('user')} placeholder="Ej: mperez" required disabled={loading} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input id="email" type="email" value={form.email} onChange={onInput('email')} required disabled={loading} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="password">{isEdit ? 'Nueva contraseña' : 'Contraseña *'}</Label>
          <Input
            id="password"
            type="password"
            value={form.password}
            onChange={onInput('password')}
            placeholder={isEdit ? 'Déjalo vacío para no cambiarla' : `Mínimo ${MIN_PASSWORD} caracteres`}
            required={!isEdit}
            disabled={loading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cellphone">Celular</Label>
          <Input id="cellphone" value={form.cellphone} onChange={onInput('cellphone')} disabled={loading} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <CatalogSelect id="idTypeDocument" label="Tipo de documento" value={form.idTypeDocument}
          onChange={set('idTypeDocument')} options={documentTypes} disabled={busy} />
        <div className="space-y-2">
          <Label htmlFor="documentNumber">N° de documento</Label>
          <Input id="documentNumber" value={form.documentNumber} onChange={onInput('documentNumber')} disabled={loading} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sex">Sexo</Label>
          <Select value={form.sex} onValueChange={set('sex')} disabled={loading}>
            <SelectTrigger id="sex" className="w-full">
              <SelectValue placeholder="Sin asignar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NONE}>Sin asignar</SelectItem>
              <SelectItem value="Female">Femenino</SelectItem>
              <SelectItem value="Male">Masculino</SelectItem>
              <SelectItem value="Other">Otro</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <CatalogSelect id="idTypeUser" label="Tipo de usuario" value={form.idTypeUser}
          onChange={set('idTypeUser')} options={userTypes} disabled={busy} />
        <CatalogSelect id="idTypeCargo" label="Puesto" value={form.idTypeCargo}
          onChange={set('idTypeCargo')} options={positions} disabled={busy} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="roles">Roles</Label>
          <Multiselect
            options={roles.map(role => ({ value: String(role.idDb), label: role.name }))}
            value={roleIds}
            onChange={setRoleIds}
            placeholder={canAssignRoles ? "Selecciona roles" : "Sin permiso para asignar roles"}
            disabled={busy || !canAssignRoles}
          />
        </div>
        {isEdit && (
          <div className="space-y-2">
            <Label htmlFor="state">Estado</Label>
            <Select value={form.state} onValueChange={set('state')} disabled={loading || isSelf}>
              <SelectTrigger id="state" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Activo</SelectItem>
                <SelectItem value="0">Inactivo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
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
          onClick={createdWithErrors ? onSuccess : onClose}
          disabled={loading}
        >
          {createdWithErrors ? 'Cerrar' : 'Cancelar'}
        </Button>
        <Button type="submit" disabled={busy || createdWithErrors}>
          {loading ? 'Guardando...' : isEdit ? 'Guardar' : 'Crear'}
        </Button>
      </div>
    </form>
  );
}
