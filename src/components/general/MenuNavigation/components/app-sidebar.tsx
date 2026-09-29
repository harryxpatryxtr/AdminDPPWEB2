"use client";

import * as React from "react";
import { Bot, Home, Settings2, SquareTerminal } from "lucide-react";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail
} from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import Logo from "@/assets/logo_traza.png";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
const items = {
  navMain: [
    {
      title: "Inicio",
      url: "/home",
      icon: Home
    },
    {
      title: "Configuracion",
      url: "#",
      icon: Settings2,
      items: [
        { title: "Dominio", url: "/domain", permission: "domain:read" },
        { title: "Tipo Usuario", url: "/type-users", permission: "user-type:read" },
        { title: "Tipo Documento", url: "/type-documents", permission: "document-type:read" },
        { title: "Tipo Puesto", url: "/type-jobs", permission: "position:read" }
      ]
    },
    {
      title: "Administrador",
      url: "#",
      icon: SquareTerminal,
      items: [
        { title: "Permiso", url: "/permissions", permission: "permission:read" },
        { title: "Rol", url: "/roles", permission: "role:read" },
        { title: "Usuario", url: "/users", permission: "user:read" }
      ]
    },
    {
      title: "REO",
      url: "#",
      icon: Bot,
      items: [{ title: "Empresa", url: "/companies" }]
    }
  ]
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = usePathname();
  const { can } = useAuth();

  // Solo las opciones que la sesión puede ver; los grupos vacíos se ocultan
  const navMain = items.navMain
    .map((item) => item.items
      ? { ...item, items: item.items.filter((sub) => !("permission" in sub) || can(sub.permission as string)) }
      : item)
    .filter((item) => !item.items || item.items.length > 0);
  const [activeMenus, setActiveMenus] = useState<{ [key: string]: boolean }>(
    {}
  );

  useEffect(() => {
    const updatedMenus: { [key: string]: boolean } = {};

    items.navMain.forEach((item) => {
      if (item.items) {
        updatedMenus[item.title] = item.items.some((subItem) =>
          location.startsWith(subItem.url)
        );
      }
    });

    setTimeout(() => {
      setActiveMenus((prev) => ({ ...prev, ...updatedMenus }));
    }, 0);
  }, [location]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Image
          src={Logo}
          alt="logo"
          width={150}
          height={150}
          className="mx-auto mt-5"
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={navMain}
          activeMenus={activeMenus}
          setActiveMenus={setActiveMenus}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
