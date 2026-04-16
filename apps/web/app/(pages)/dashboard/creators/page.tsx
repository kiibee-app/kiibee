"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/Layout/Dashboard";
import Sidebar from "@/components/Layout/Sidebar";
import DashboardContent from "@/components/Feature/Dashboard/DashboardContent";
import { CREATORS_LABELS } from "@/utils/SidebarItems";
import DashboardHeader from "@/components/Layout/DashboardHeader";

export default function DashboardCreatorsPage() {
  const [activePage, setActivePage] = useState<string>(
    CREATORS_LABELS.OVERVIEW,
  );
  const [open, setOpen] = useState(false);

  const renderHeader = () => {
    return <DashboardHeader onToggleSidebar={() => setOpen((p) => !p)} />;
  };

  const renderContent = () => {
    if (activePage === CREATORS_LABELS.OVERVIEW) return <DashboardContent />;
    return <div style={{ padding: 20 }}>Content for {activePage}</div>;
  };

  return (
    <DashboardLayout
      header={renderHeader()}
      sidebar={
        <Sidebar
          open={open}
          onClose={() => setOpen(false)}
          activeItem={activePage}
          onSelect={setActivePage}
        />
      }
    >
      {renderContent()}
    </DashboardLayout>
  );
}
