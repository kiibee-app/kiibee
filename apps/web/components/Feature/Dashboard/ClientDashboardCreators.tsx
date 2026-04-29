"use client";

import React, { useCallback, useMemo, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import CreatorProfile from "@/components/Feature/Dashboard/CreatorProfile";
import DashboardLayout from "@/components/Layout/Dashboard";
import Sidebar from "@/components/Layout/Sidebar";
import { CREATORS_LABELS } from "@/utils/SidebarItems";
import DashboardHeader from "@/components/Layout/DashboardHeader";
import OverviewContent from "@/components/Feature/Overview/OverviewContent";
import SettingsContent from "../Settings";
import { VIEW } from "@/utils/Constants";
import CreatorsContents from "../Contents/page";

const ROUTABLE_DASHBOARD_VIEWS = new Set<string>([
  CREATORS_LABELS.OVERVIEW,
  CREATORS_LABELS.CONTENTS,
  CREATORS_LABELS.USERS,
  CREATORS_LABELS.SETTINGS,
  CREATORS_LABELS.HELP,
  CREATORS_LABELS.PROFILE,
]);

export default function ClientDashboardCreators() {
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
  const viewParam = searchParams?.get(VIEW);
  const view =
    viewParam && ROUTABLE_DASHBOARD_VIEWS.has(viewParam)
      ? viewParam
      : CREATORS_LABELS.OVERVIEW;
  const activePage =
    view === CREATORS_LABELS.PROFILE ? CREATORS_LABELS.OVERVIEW : view;

  const router = useRouter();
  const pathname = usePathname();

  const getHrefForView = useCallback(
    (label: string) => {
      const params = new URLSearchParams(searchParams?.toString() ?? "");

      if (label === CREATORS_LABELS.OVERVIEW) {
        params.delete(VIEW);
      } else {
        params.set(VIEW, label);
      }

      const qs = params.toString();
      return qs ? `${pathname}?${qs}` : pathname;
    },
    [pathname, searchParams],
  );

  const handleSelect = useCallback(
    (label: string) => {
      router.push(getHrefForView(label), { scroll: false });
    },
    [getHrefForView, router],
  );

  const renderContent = useMemo(() => {
    if (view === CREATORS_LABELS.PROFILE) return <CreatorProfile />;
    if (activePage === CREATORS_LABELS.OVERVIEW) return <OverviewContent />;
    if (activePage === CREATORS_LABELS.SETTINGS) return <SettingsContent />;
    if (activePage === CREATORS_LABELS.CONTENTS) return <CreatorsContents />;
    return <div style={{ padding: 20 }}>Content for {activePage}</div>;
  }, [activePage, view]);

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
      {renderContent}
    </DashboardLayout>
  );
}
