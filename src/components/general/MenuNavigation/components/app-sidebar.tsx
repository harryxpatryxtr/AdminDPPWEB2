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
const items = {
  user: {
    name: "Pedro Mollehuanca",
    email: "pedro.mollehuanca@umatechnology.io",
    avatar: "/avatars/shadcn.jpg"
  },
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
        { title: "Dominio", url: "/dominio" },
        { title: "Tipo Usuario", url: "/tipo-usuario" },
        { title: "Tipo Documento", url: "/tipo-documento" },
        { title: "Tipo Cargo", url: "/tipo-cargo" }
      ]
    },
    {
      title: "Administrador",
      url: "#",
      icon: SquareTerminal,
      items: [
        { title: "Permiso", url: "/permiso" },
        { title: "Rol", url: "/rol" },
        { title: "Usuario", url: "/usuario" }
      ]
    },
    {
      title: "REO",
      url: "#",
      icon: Bot,
      items: [{ title: "Empresa", url: "/empresa" }]
    }
  ]
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = usePathname();
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
          items={items.navMain}
          activeMenus={activeMenus}
          setActiveMenus={setActiveMenus}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={items.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
