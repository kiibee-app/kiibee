"use client";

import React, { useCallback, useMemo, useState } from "react";
import DashboardLayout from "@/components/Layout/Dashboard";
import Sidebar from "@/components/Layout/Sidebar";
import ViewerDashboardHeader from "@/components/Layout/ViewerDashboardHeader";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
import { GenericModal } from "@/components/UI/Modals";
import { useTranslation } from "react-i18next";
import { PATHS } from "@/utils/path";
import {
  clearLoginSession,
  getStoredLoginUserEmail,
  useLogout,
} from "@/hooks/auth/useLogin";
import ClientViewerBillings from "@/components/Feature/Dashboard/ClientViewerBillings";
import RentedContent from "@/components/Feature/Dashboard/ViewerSections/RentedContent";
import { RENTED_MODES } from "@/utils/viewerRented";
import ClientViewerProfile from "@/components/Feature/Dashboard/ClientViewerProfile";

const ROUTABLE_VIEWER_VIEWS = new Set<string>([
  VIEWER_VIEW_VALUES.PURCHASED,
  VIEWER_VIEW_VALUES.CURRENTLY_RENTED,
  VIEWER_VIEW_VALUES.PREVIOUSLY_RENTED,
  VIEWER_VIEW_VALUES.BILLINGS,
  VIEWER_VIEW_VALUES.MY_PROFILE,
]);

export default function ClientDashboardViewer() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [logoutEmail, setLogoutEmail] = useState("");
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { mutateAsync: logout } = useLogout();

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
    setLogoutEmail(getStoredLoginUserEmail());
    setShowLogoutModal(true);
  }, []);

  const handleCancelLogout = useCallback(() => {
    setShowLogoutModal(false);
  }, []);

  const handleConfirmLogout = useCallback(async () => {
    setShowLogoutModal(false);
    try {
      await logout();
    } catch {
    } finally {
      clearLoginSession();
      router.push(PATHS.AUTH_LOGIN);
    }
  }, [logout, router]);

  const sectionTitle = useMemo(() => activePage, [activePage]);

  return (
    <DashboardLayout
      header={
        <ViewerDashboardHeader
          onToggleSidebar={toggleSidebar}
          onProfileClick={() => handleSelect(VIEWER_LABELS.MY_PROFILE)}
        />
      }
      contentPadding={activePage === VIEWER_LABELS.PURCHASED ? "0" : undefined}
      sidebar={
        <Sidebar
          open={open}
          onClose={closeSidebar}
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
        />
      ) : activePage === VIEWER_LABELS.CURRENTLY_RENTED ? (
        <RentedContent
          key={RENTED_MODES.CURRENTLY}
          title={sectionTitle}
          mode={RENTED_MODES.CURRENTLY}
        />
      ) : activePage === VIEWER_LABELS.PREVIOUSLY_RENTED ? (
        <RentedContent
          key={RENTED_MODES.PREVIOUSLY}
          title={sectionTitle}
          mode={RENTED_MODES.PREVIOUSLY}
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
        width="480px"
        padding="40px 32px"
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
