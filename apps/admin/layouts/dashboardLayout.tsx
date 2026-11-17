"use client";

import { useCallback, useEffect, useState } from "react";
import { breakpoints } from "@repo/ui/breakpoints";
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isLoginRoute = pathname === "/login";
  const meta = getPageMeta(pathname);

  const toggleSidebar = useCallback(() => setSidebarOpen((prev) => !prev), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  useEffect(() => {
    if (!sidebarOpen || isLoginRoute) return;

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeSidebar();
    };
    const mobileViewport = window.matchMedia(
      `(max-width: ${breakpoints.tablet})`,
    );
    const previousOverflow = document.body.style.overflow;
    const syncScrollLock = () => {
      document.body.style.overflow = mobileViewport.matches
        ? "hidden"
        : previousOverflow;
    };
    syncScrollLock();
    mobileViewport.addEventListener("change", syncScrollLock);
    window.addEventListener("keydown", handleEsc);
    return () => {
      document.body.style.overflow = previousOverflow;
      mobileViewport.removeEventListener("change", syncScrollLock);
      window.removeEventListener("keydown", handleEsc);
    };
  }, [closeSidebar, sidebarOpen, isLoginRoute]);

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
      <Main $sidebarOpen={sidebarOpen}>
        <Header
          title={meta.title}
          description={meta.description}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={toggleSidebar}
        />
        <Content>{children}</Content>
      </Main>
      {sidebarOpen && <Backdrop onClick={closeSidebar} />}
    </AppContainer>
  );
}
