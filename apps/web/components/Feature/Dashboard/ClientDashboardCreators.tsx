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
import CreatorsContents from "../Contents/page";
import { GenericModal } from "@/components/UI/Modals";
import { MonoText } from "@/components/UI/Monotext";
import { creatorProfileData } from "@/utils/dummyData/profile.data";
import { useTranslation } from "react-i18next";
import { PATHS } from "@/utils/path";

export default function ClientDashboardCreators() {
  const { t } = useTranslation();
  const [activePage, setActivePage] = useState<string>(
    CREATORS_LABELS.OVERVIEW,
  );
  const [open, setOpen] = useState<boolean>(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const toggleSidebar = useCallback(() => {
    setOpen((p) => !p);
  }, []);

  const closeSidebar = useCallback(() => {
    setOpen(false);
  }, []);

  const handleLogoutClick = useCallback(() => {
    setShowLogoutModal(true);
  }, []);

  const handleCancelLogout = useCallback(() => {
    setShowLogoutModal(false);
  }, []);

  const handleConfirmLogout = useCallback(() => {
    setShowLogoutModal(false);
    router.push(PATHS.AUTH_LOGIN);
  }, [router]);

  const renderHeader = () => {
    return <DashboardHeader onToggleSidebar={toggleSidebar} />;
  };

  const view = searchParams?.get(VIEW);

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
    if (activePage === CREATORS_LABELS.CONTENTS) return <CreatorsContents />;
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
          onLogout={handleLogoutClick}
        />
      }
    >
      {renderContent()}
      <GenericModal
        visible={showLogoutModal}
        title={t("dashboard.logoutModal.title")}
        buttonRow
        confirmLabel={t("dashboard.logoutModal.confirm")}
        cancelLabel={t("common.cancel")}
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
        onClose={handleCancelLogout}
        width="480px"
        padding="40px 32px"
        buttonAlign="center"
        textAlign="center"
        showCloseButton={false}
      >
        <MonoText $use="Body_Medium">
          {t("dashboard.logoutModal.message", {
            email: creatorProfileData.email,
          })}
        </MonoText>
      </GenericModal>
    </DashboardLayout>
  );
}
