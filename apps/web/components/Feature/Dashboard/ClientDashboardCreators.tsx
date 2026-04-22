"use client";

import React, { useCallback, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import CreatorProfile from "@/components/Feature/Dashboard/CreatorProfile";
import DashboardLayout from "@/components/Layout/Dashboard";
import Sidebar from "@/components/Layout/Sidebar";
import { CREATORS_LABELS } from "@/utils/SidebarItems";
import DashboardHeader from "@/components/Layout/DashboardHeader";
import OverviewContent from "@/components/Feature/Overview/OverviewContent";
import SettingsContent from "../Settings";
import { VIEW } from "@/utils/Constants";

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
  const view = searchParams?.get(VIEW);

  const router = useRouter();
  const pathname = usePathname();

  const handleSelect = useCallback(
    (label: string) => {
      setActivePage(label);

      const params = new URLSearchParams(searchParams?.toString() ?? "");
      if (params.has(VIEW)) {
        params.delete(VIEW);
        const qs = params.toString();
        const href = qs ? `${pathname}?${qs}` : pathname;
        router.replace(href);
      }
    },
    [pathname, router, searchParams],
  );

  const renderContent = () => {
    if (view === CREATORS_LABELS.PROFILE) return <CreatorProfile />;
    if (activePage === CREATORS_LABELS.OVERVIEW) return <OverviewContent />;
    if (activePage === CREATORS_LABELS.SETTINGS) return <SettingsContent />;
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
