"use client";

import React, { useCallback, useMemo, useState } from "react";
import DashboardLayout from "@/components/Layout/Dashboard";
import Sidebar from "@/components/Layout/Sidebar";
import ViewerDashboardHeader from "@/components/Layout/ViewerDashboardHeader";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PATHS } from "@/utils/path";
import { VIEW } from "@/utils/Constants";
import {
  VIEWER_LABEL_TO_VIEW,
  VIEWER_LABELS,
  VIEWER_VIEW_TO_LABEL,
  VIEWER_VIEW_VALUES,
  ViewerLabel,
  ViewerViewValue,
  viewerItems,
} from "@/utils/SidebarItems";
import { MonoText } from "@/components/UI/Monotext";

const ROUTABLE_VIEWER_VIEWS = new Set<string>([
  VIEWER_VIEW_VALUES.PURCHASED,
  VIEWER_VIEW_VALUES.CURRENTLY_RENTED,
  VIEWER_VIEW_VALUES.PREVIOUSLY_RENTED,
  VIEWER_VIEW_VALUES.BILLINGS,
  VIEWER_VIEW_VALUES.MY_PROFILE,
]);

export default function ClientDashboardViewer() {
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const toggleSidebar = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setOpen(false);
  }, []);

  const viewParam = searchParams?.get(VIEW);
  const activePage: ViewerLabel =
    viewParam && ROUTABLE_VIEWER_VIEWS.has(viewParam)
      ? VIEWER_VIEW_TO_LABEL[viewParam as ViewerViewValue]
      : VIEWER_LABELS.PURCHASED;

  const getHrefForView = useCallback(
    (label: ViewerLabel) => {
      const params = new URLSearchParams(searchParams?.toString() ?? "");

      if (label === VIEWER_LABELS.PURCHASED) {
        params.delete(VIEW);
      } else {
        params.set(VIEW, VIEWER_LABEL_TO_VIEW[label]);
      }

      const qs = params.toString();
      return qs ? `${pathname}?${qs}` : pathname;
    },
    [pathname, searchParams],
  );

  const handleSelect = useCallback(
    (label: ViewerLabel) => {
      router.push(getHrefForView(label), { scroll: false });
    },
    [getHrefForView, router],
  );

  const handleSidebarSelect = useCallback(
    (label: string) => {
      if (!(label in VIEWER_LABEL_TO_VIEW)) return;
      handleSelect(label as ViewerLabel);
    },
    [handleSelect],
  );

  const handleLogout = useCallback(() => {
    router.push(PATHS.AUTH_LOGIN);
  }, [router]);

  const sectionTitle = useMemo(() => activePage, [activePage]);

  return (
    <DashboardLayout
      header={<ViewerDashboardHeader onToggleSidebar={toggleSidebar} />}
      sidebar={
        <Sidebar
          open={open}
          onClose={closeSidebar}
          activeItem={activePage}
          onSelect={handleSidebarSelect}
          onLogout={handleLogout}
          items={viewerItems}
          logoutLabel={VIEWER_LABELS.LOG_OUT}
        />
      }
    >
      <MonoText $use="H4_SemiBold">{sectionTitle}</MonoText>
    </DashboardLayout>
  );
}
