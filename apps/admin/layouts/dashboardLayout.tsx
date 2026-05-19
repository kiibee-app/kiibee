"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Header } from "../components/header/Header";
import { Sidebar } from "../components/sidebar/Sidebar";
import { sidebarItems } from "../register/sidebar";
import { getPageMeta } from "../seo/metadata";
import {
  AppContainer,
  Backdrop,
  Content,
  Main,
} from "./dashboardLayout.styles";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isLoginRoute = pathname === "/login";
  const meta = getPageMeta(pathname);

  const toggleSidebar = useCallback(() => setSidebarOpen((prev) => !prev), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  useEffect(() => {
    if (!sidebarOpen) return;

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeSidebar();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEsc);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEsc);
    };
  }, [closeSidebar, sidebarOpen]);

  if (isLoginRoute) {
    return <>{children}</>;
  }

  return (
    <AppContainer>
      <Sidebar
        items={sidebarItems}
        pathname={pathname}
        isOpen={sidebarOpen}
        onClose={closeSidebar}
      />
      <Main>
        <Header
          title={meta.title}
          description={meta.description}
          onToggleSidebar={toggleSidebar}
        />
        <Content>{children}</Content>
      </Main>
      {sidebarOpen && <Backdrop onClick={closeSidebar} />}
    </AppContainer>
  );
}
