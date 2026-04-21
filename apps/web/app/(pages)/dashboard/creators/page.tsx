import React, { Suspense } from "react";
import ClientDashboardCreators from "@/components/Feature/Dashboard/ClientDashboardCreators";

export default function DashboardCreatorsPage() {
"use client";

import React, { useCallback, useState } from "react";
import DashboardLayout from "@/components/Layout/Dashboard";
import Sidebar from "@/components/Layout/Sidebar";
import { CREATORS_LABELS } from "@/utils/SidebarItems";
import DashboardHeader from "@/components/Layout/DashboardHeader";
import OverviewContent from "@/components/Feature/Overview/OverviewContent";
import SettingsContent from "@/components/Feature/Settings";

export default function DashboardCreatorsPage() {
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

  const renderContent = () => {
    if (activePage === CREATORS_LABELS.OVERVIEW) return <OverviewContent />;
    if (activePage === CREATORS_LABELS.SETTINGS) return <SettingsContent />;
    return <div style={{ padding: 20 }}>Content for {activePage}</div>;
  };

  return (
    <Suspense fallback={<div />}>
      <ClientDashboardCreators />
    </Suspense>
  );
}
