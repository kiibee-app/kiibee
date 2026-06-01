"use client";

import React, { useCallback, useMemo, useState } from "react";
import { useSidebarExpanded } from "@/hooks/useSidebarExpanded";
import DashboardLayout from "@/components/Layout/Dashboard";
import Sidebar from "@/components/Layout/Sidebar";
import DashboardHeader from "@/components/Layout/DashboardHeader";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  SIDEBAR_COLLAPSE_BREAKPOINT,
  VIEW,
  VIEWER_SECTION,
  ROLE_VIEWER,
} from "@/utils/Constants";
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
import { GenericModal } from "@/components/UI/Modals";
import { useTranslation } from "react-i18next";
import { useLogout } from "@/hooks/auth/useLogout";
import { useAuthSession } from "@/hooks/auth/useAuthSession";
import { useRequireAuthSession } from "@/hooks/auth/useRequireAuthSession";
import ClientViewerBillings from "@/components/Feature/Dashboard/ClientViewerBillings";
import ClientViewerProfile from "@/components/Feature/Dashboard/ClientViewerProfile";
import RentedContent from "@/components/Feature/Dashboard/ViewerSections/RentedContent";
import { RENTED_MODES } from "@/utils/viewerRented";

const ROUTABLE_VIEWER_VIEWS = new Set<string>([
  VIEWER_VIEW_VALUES.PURCHASED,
  VIEWER_VIEW_VALUES.CURRENTLY_RENTED,
  VIEWER_VIEW_VALUES.PREVIOUSLY_RENTED,
  VIEWER_VIEW_VALUES.BILLINGS,
  VIEWER_VIEW_VALUES.MY_PROFILE,
]);

type Props = {
  initialCollectionsExpanded?: boolean;
};

export default function ClientDashboardViewer({
  initialCollectionsExpanded = false,
}: Props) {
  const { t } = useTranslation();
  const { sidebarExpanded, toggleSidebar, collapseSidebar } =
    useSidebarExpanded(SIDEBAR_COLLAPSE_BREAKPOINT);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [logoutEmail, setLogoutEmail] = useState("");
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useLogout();
  const { getUser } = useAuthSession();
  useRequireAuthSession();

  const viewParam = searchParams?.get(VIEW);
  const activePage: ViewerLabel =
    viewParam && ROUTABLE_VIEWER_VIEWS.has(viewParam)
      ? VIEWER_VIEW_TO_LABEL[viewParam as ViewerViewValue]
      : VIEWER_LABELS.PURCHASED;

  const getHrefForView = useCallback(
    (label: ViewerLabel) => {
      const params = new URLSearchParams(searchParams?.toString() ?? "");

      params.delete(VIEWER_SECTION);

      if (label === VIEWER_LABELS.PURCHASED) {
        params.delete(VIEW);
      } else {
        const viewValue = VIEWER_LABEL_TO_VIEW[label];
        if (viewValue) {
          params.set(VIEW, viewValue);
        }
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

  const handleLogoutClick = useCallback(() => {
    const email = (getUser() as { email?: string })?.email || "";
    setLogoutEmail(email);
    setShowLogoutModal(true);
  }, [getUser]);

  const handleCancelLogout = useCallback(() => {
    setShowLogoutModal(false);
  }, []);

  const handleConfirmLogout = useCallback(async () => {
    setShowLogoutModal(false);
    await logout();
  }, [logout]);

  const sectionTitle = useMemo(() => activePage, [activePage]);

  return (
    <DashboardLayout
      sidebarExpanded={sidebarExpanded}
      header={
        <DashboardHeader
          role={ROLE_VIEWER}
          onToggleSidebar={toggleSidebar}
          onProfileClick={() => handleSelect(VIEWER_LABELS.MY_PROFILE)}
        />
      }
      contentPadding={
        activePage === VIEWER_LABELS.PURCHASED ||
        activePage === VIEWER_LABELS.CURRENTLY_RENTED ||
        activePage === VIEWER_LABELS.PREVIOUSLY_RENTED
          ? "0"
          : undefined
      }
      sidebar={
        <Sidebar
          expanded={sidebarExpanded}
          onCollapse={collapseSidebar}
          activeItem={activePage}
          onSelect={handleSidebarSelect}
          onLogout={handleLogoutClick}
          items={viewerItems}
          logoutLabel={VIEWER_LABELS.LOG_OUT}
        />
      }
    >
      {activePage === VIEWER_LABELS.PURCHASED ? (
        <RentedContent
          key={RENTED_MODES.PURCHASED}
          title={sectionTitle}
          mode={RENTED_MODES.PURCHASED}
          initialCollectionsExpanded={initialCollectionsExpanded}
        />
      ) : activePage === VIEWER_LABELS.CURRENTLY_RENTED ? (
        <RentedContent
          key={RENTED_MODES.CURRENTLY}
          title={sectionTitle}
          mode={RENTED_MODES.CURRENTLY}
          initialCollectionsExpanded={initialCollectionsExpanded}
        />
      ) : activePage === VIEWER_LABELS.PREVIOUSLY_RENTED ? (
        <RentedContent
          key={RENTED_MODES.PREVIOUSLY}
          title={sectionTitle}
          mode={RENTED_MODES.PREVIOUSLY}
          initialCollectionsExpanded={initialCollectionsExpanded}
        />
      ) : activePage === VIEWER_LABELS.BILLINGS ? (
        <ClientViewerBillings />
      ) : activePage === VIEWER_LABELS.MY_PROFILE ? (
        <ClientViewerProfile />
      ) : (
        <MonoText $use="H4_SemiBold">{sectionTitle}</MonoText>
      )}
      <GenericModal
        visible={showLogoutModal}
        title={t("dashboard.logoutModal.title")}
        buttonRow
        confirmLabel={t("dashboard.logoutModal.confirm")}
        cancelLabel={t("common.cancel")}
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
        onClose={handleCancelLogout}
        size="sm"
        spacing="sm"
        buttonAlign="center"
        textAlign="center"
        showCloseButton={false}
      >
        <MonoText $use="Body_Medium">
          {t("dashboard.logoutModal.message", {
            email: logoutEmail,
          })}
        </MonoText>
      </GenericModal>
    </DashboardLayout>
  );
}
