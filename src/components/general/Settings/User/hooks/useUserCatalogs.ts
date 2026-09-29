'use client';
import { useEffect, useState } from "react";
import { roleService } from "@/services/roleService";
import { userTypeService } from "@/services/userTypeService";
import { documentTypeService } from "@/services/documentTypeService";
import { positionService } from "@/services/positionService";
import type { CatalogItem } from "../../common";

type Catalogs = {
  roles: CatalogItem[];
  userTypes: CatalogItem[];
  documentTypes: CatalogItem[];
  positions: CatalogItem[];
};

// Opciones para los selects del formulario. Si la sesión no puede leer
// algún catálogo, esa lista queda vacía en lugar de bloquear el formulario.
export const useUserCatalogs = () => {
  const [catalogs, setCatalogs] = useState<Catalogs>({
    roles: [],
    userTypes: [],
    documentTypes: [],
    positions: [],
  });
  const [loadingCatalogs, setLoadingCatalogs] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      roleService.getAllRoles(),
      userTypeService.getAllUserTypes(),
      documentTypeService.getAllDocumentTypes(),
      positionService.getAllPositions(),
    ]).then(([roles, userTypes, documentTypes, positions]) => {
      const valueOf = (result: PromiseSettledResult<CatalogItem[]>) =>
        result.status === 'fulfilled' ? result.value : [];
      setCatalogs({
        roles: valueOf(roles),
        userTypes: valueOf(userTypes),
        documentTypes: valueOf(documentTypes),
        positions: valueOf(positions),
      });
      setLoadingCatalogs(false);
    });
  }, []);

  return { ...catalogs, loadingCatalogs };
};
