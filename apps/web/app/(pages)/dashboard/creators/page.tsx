"use client";

import React, { useState } from "react";
import { SidebarHeader } from "@/components/Layout/Sidebar/styles";
import DashboardLayout from "@/components/Layout/Dashboard";
import Sidebar from "@/components/Layout/Sidebar";
import OverviewContent from "@/components/Feature/OverView/OverviewContents";
import { CREATORS_LABELS } from "@/utils/SidebarItems";

export default function DashboardCreatorsPage() {
  const [activePage, setActivePage] = useState<string>(
    CREATORS_LABELS.OVERVIEW,
  );

  const renderHeader = () => {
    return <SidebarHeader title={activePage} />;
  };

  const renderContent = () => {
    if (activePage === CREATORS_LABELS.OVERVIEW) return <OverviewContent />;
    return <div style={{ padding: 20 }}>Content for {activePage}</div>;
  };

  return (
    <DashboardLayout
      header={renderHeader()}
      sidebar={<Sidebar activeItem={activePage} onSelect={setActivePage} />}
    >
      {renderContent()}
    </DashboardLayout>
  );
}
