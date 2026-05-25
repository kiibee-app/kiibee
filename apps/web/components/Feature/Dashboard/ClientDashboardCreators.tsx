"use client";

import React, { useCallback, useMemo, useState } from "react";
import { useSidebarExpanded } from "@/hooks/useSidebarExpanded";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import CreatorProfile from "@/components/Feature/Dashboard/CreatorProfile";
import DashboardLayout from "@/components/Layout/Dashboard";
import Sidebar from "@/components/Layout/Sidebar";
import { CREATORS_LABELS } from "@/utils/SidebarItems";
import DashboardHeader from "@/components/Layout/DashboardHeader";
import OverviewContent from "@/components/Feature/Overview/OverviewContent";
import SettingsContent from "../Settings";
import {
  DASHBOARD_SIDEBAR_COLLAPSE_BREAKPOINT,
  VIEW,
  ROLE_CREATOR,
} from "@/utils/Constants";
import CreatorsContents from "../Contents";
import { GenericModal } from "@/components/UI/Modals";
import { MonoText } from "@/components/UI/Monotext";
import { useTranslation } from "react-i18next";
import UsersContent from "../Users/UsersContent";
import { useLogout } from "@/hooks/auth/useLogout";
import { useAuthSession } from "@/hooks/auth/useAuthSession";
import { useProfileSync } from "@/hooks/auth/useProfileSync";
import { CreatorChannelLayoutProvider } from "@/hooks/useCreatorChannelLayout";
import { useRequireAuthSession } from "@/hooks/auth/useRequireAuthSession";

const ROUTABLE_DASHBOARD_VIEWS = new Set<string>([
  CREATORS_LABELS.OVERVIEW,
  CREATORS_LABELS.CONTENTS,
  CREATORS_LABELS.USERS,
  CREATORS_LABELS.SETTINGS,
  CREATORS_LABELS.HELP,
  CREATORS_LABELS.PROFILE,
]);

export default function ClientDashboardCreators() {
  const { t } = useTranslation();
  const { sidebarExpanded, toggleSidebar, collapseSidebar } =
    useSidebarExpanded(DASHBOARD_SIDEBAR_COLLAPSE_BREAKPOINT);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [logoutEmail, setLogoutEmail] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { logout } = useLogout();
  const { getUser } = useAuthSession();
  useRequireAuthSession();
  useProfileSync();

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

  const renderHeader = () => {
    return (
      <DashboardHeader role={ROLE_CREATOR} onToggleSidebar={toggleSidebar} />
    );
  };
  const viewParam = searchParams?.get(VIEW);
  const view =
    viewParam && ROUTABLE_DASHBOARD_VIEWS.has(viewParam)
      ? viewParam
      : CREATORS_LABELS.OVERVIEW;
  const activePage =
    view === CREATORS_LABELS.PROFILE ? CREATORS_LABELS.OVERVIEW : view;

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
    if (activePage === CREATORS_LABELS.USERS) return <UsersContent />;
    return <div style={{ padding: 20 }}>Content for {activePage}</div>;
  }, [activePage, view]);

  return (
    <CreatorChannelLayoutProvider>
      <DashboardLayout
        header={renderHeader()}
        sidebarExpanded={sidebarExpanded}
        sidebar={
          <Sidebar
            expanded={sidebarExpanded}
            onCollapse={collapseSidebar}
            activeItem={activePage}
            onSelect={handleSelect}
            onLogout={handleLogoutClick}
          />
        }
      >
        {renderContent}
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
    </CreatorChannelLayoutProvider>
  );
}
