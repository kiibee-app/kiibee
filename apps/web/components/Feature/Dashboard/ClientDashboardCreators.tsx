"use client";

import React, { useCallback, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import CreatorProfile from "@/components/Feature/CreatorProfile";
import DashboardLayout from "@/components/Layout/Dashboard";
import Sidebar from "@/components/Layout/Sidebar";
import { CREATORS_LABELS } from "@/utils/SidebarItems";
import DashboardHeader from "@/components/Layout/DashboardHeader";
import OverviewContent from "@/components/Feature/Overview/OverviewContent";

export default function ClientDashboardCreators() {
  const [activePage, setActivePage] = useState<string>(
    CREATORS_LABELS.OVERVIEW,
  );
  const [open, setOpen] = useState<boolean>(false);

  const toggleSidebar = useCallback(() => {
    setOpen((p) => !p);
  }, []);

  const closeSidebar = useCallback(() => {
    setOpen(false);
  }, []);

  const renderHeader = () => {
    return <DashboardHeader onToggleSidebar={toggleSidebar} />;
  };

  const searchParams = useSearchParams();
  const view = searchParams?.get("view");

  const router = useRouter();
  const pathname = usePathname();

  const handleSelect = useCallback(
    (label: string) => {
      setActivePage(label);

      const params = new URLSearchParams(searchParams?.toString() ?? "");
      if (params.has("view")) {
        params.delete("view");
        const qs = params.toString();
        const href = qs ? `${pathname}?${qs}` : pathname;
        router.replace(href);
      }
    },
    [pathname, router, searchParams],
  );

  const renderContent = () => {
    if (view === "profile") return <CreatorProfile />;
    if (activePage === CREATORS_LABELS.OVERVIEW) return <OverviewContent />;
    return <div style={{ padding: 20 }}>Content for {activePage}</div>;
  };

  return (
    <DashboardLayout
      header={renderHeader()}
      sidebar={
        <Sidebar
          open={open}
          onClose={closeSidebar}
          activeItem={activePage}
          onSelect={handleSelect}
        />
      }
    >
      {renderContent()}
    </DashboardLayout>
  );
}
