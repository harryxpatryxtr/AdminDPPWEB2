import React from "react";
import { MenuNavigation } from "@/components/general";
import { Toaster } from "@/components/ui/sonner";
interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <MenuNavigation>
        {children}
      </MenuNavigation>
      <Toaster position="top-right" />
    </>
  );
};

export default Layout;
