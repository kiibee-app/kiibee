"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import CardIcon from "@/assets/icons/CardIcon";
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
  SIDEBAR_COLLAPSE_BREAKPOINT,
  VIEW,
  ROLE_CREATOR,
  SCROLL_TO_PLANS_KEY,
} from "@/utils/Constants";
import CreatorsContents from "../Contents";
import { GenericModal } from "@/components/UI/Modals";
import { MonoText } from "@/components/UI/Monotext";
import { useTranslation } from "react-i18next";
import UsersContent from "../Users/UsersContent";
import { toast } from "react-toastify";
import { useLogout } from "@/hooks/auth/useLogout";
import { useAuthSession } from "@/hooks/auth/useAuthSession";
import { useProfileSync } from "@/hooks/auth/useProfileSync";
import { useCreatorPaymentInfo } from "@/hooks/useCreatorPaymentInfo";
import { CreatorChannelLayoutProvider } from "@/hooks/useCreatorChannelLayout";
import { useRequireAuthSession } from "@/hooks/auth/useRequireAuthSession";
import { sanitizeDashboardQueryParams } from "@/utils/dashboardQueryParams";
import { requestCreatorPaymentInfoFocus } from "@/utils/creatorPaymentInfoFocus";
import { useGetAPI } from "@/lib/http/api/getApi";
import { API } from "@/lib/http/api/endpoints";
import { FRESH_QUERY_OPTIONS } from "@/utils/common";
import { PATHS } from "@/utils/path";
import { useAppLanguage, useLocalizedHref } from "@/hooks/useLocalizedPaths";
import {
  formatSearch,
  getCanonicalParam,
  localizeSearchParams,
  toCanonicalSearchParams,
} from "@/utils/localizedQueryParams";

const UpgradeIcon = styled.span`
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  border-radius: 20px;
  background: ${({ theme }) => theme.colors.primary.PALE_GREEN};
  color: ${({ theme }) => theme.colors.primary.GREEN_100};
`;

const UpgradeDescription = styled(MonoText)`
  display: block;
  max-width: 34ch;
  margin-inline: auto;
  color: ${({ theme }) => theme.colors.neutral.GRAY_700};
  line-height: 1.55;
`;

const ROUTABLE_DASHBOARD_VIEWS = new Set<string>([
  CREATORS_LABELS.OVERVIEW,
  CREATORS_LABELS.CONTENTS,
  CREATORS_LABELS.USERS,
  CREATORS_LABELS.SETTINGS,
  CREATORS_LABELS.HELP,
  CREATORS_LABELS.PROFILE,
]);

const ADD_PAYMENT_TOAST_ID = "creator-add-payment-info";

export default function ClientDashboardCreators() {
  const { t } = useTranslation();
  const language = useAppLanguage();
  const localizeHref = useLocalizedHref();
  const { sidebarExpanded, toggleSidebar, collapseSidebar } =
    useSidebarExpanded(SIDEBAR_COLLAPSE_BREAKPOINT);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [logoutEmail, setLogoutEmail] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { logout } = useLogout();
  const { getRole, getUser } = useAuthSession();
  const { hasPaymentInfo, isLoading: isPaymentInfoLoading } =
    useCreatorPaymentInfo();
  const { isReady } = useRequireAuthSession();
  const { data: creatorPlanResponse, isLoading: isCreatorPlanLoading } =
    useGetAPI<{
      data?: {
        name: string;
        isPaidPlan: boolean;
        manuallyPaid?: boolean;
        subscriptionUpgradeRequired?: boolean;
      }[];
    }>(API.subscription.creatorPlan, undefined, {
      ...FRESH_QUERY_OPTIONS,
      enabled: isReady && getRole() === ROLE_CREATOR,
      refetchInterval: 30_000,
    });
  const creatorPlan = creatorPlanResponse?.data?.[0];
  const upgradeRequired =
    creatorPlan?.isPaidPlan === true &&
    creatorPlan.subscriptionUpgradeRequired === true &&
    !creatorPlan.manuallyPaid;
  const assignedPaidPlan = creatorPlan?.isPaidPlan ? creatorPlan : undefined;
  useProfileSync();
  const hasLockedToPaymentInfoRef = useRef(false);

  const warnAddPaymentInfo = useCallback(() => {
    toast.warning(t("errors.addPaymentMethod"), {
      toastId: ADD_PAYMENT_TOAST_ID,
    });
    requestCreatorPaymentInfoFocus();
  }, [t]);

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
  const viewParam = getCanonicalParam(searchParams ?? undefined, VIEW);
  const view =
    viewParam && ROUTABLE_DASHBOARD_VIEWS.has(viewParam)
      ? viewParam
      : CREATORS_LABELS.OVERVIEW;
  const activePage =
    view === CREATORS_LABELS.PROFILE ? CREATORS_LABELS.OVERVIEW : view;

  const getHrefForView = useCallback(
    (label: string) => {
      const params = toCanonicalSearchParams(searchParams?.toString() ?? "");
      const targetView =
        label === CREATORS_LABELS.OVERVIEW ? CREATORS_LABELS.OVERVIEW : label;

      if (label === CREATORS_LABELS.OVERVIEW) {
        params.delete(VIEW);
      } else {
        params.set(VIEW, label);
      }

      sanitizeDashboardQueryParams(params, targetView);

      return `${pathname}${formatSearch(localizeSearchParams(params, language))}`;
    },
    [pathname, searchParams, language],
  );

  useEffect(() => {
    const params = toCanonicalSearchParams(searchParams?.toString() ?? "");
    if (!sanitizeDashboardQueryParams(params, view)) return;

    router.replace(
      `${pathname}${formatSearch(localizeSearchParams(params, language))}`,
      { scroll: false },
    );
  }, [pathname, router, searchParams, view, language]);

  const isCreatorMissingPaymentInfo =
    getRole() === ROLE_CREATOR &&
    !isPaymentInfoLoading &&
    !isCreatorPlanLoading &&
    !hasPaymentInfo &&
    !creatorPlan?.manuallyPaid;

  const redirectToPaymentInfo = useCallback(() => {
    const params = toCanonicalSearchParams(searchParams?.toString() ?? "");
    params.set(VIEW, CREATORS_LABELS.PROFILE);
    sanitizeDashboardQueryParams(params, CREATORS_LABELS.PROFILE);
    router.replace(
      `${pathname}${formatSearch(localizeSearchParams(params, language))}`,
      { scroll: false },
    );
  }, [pathname, router, searchParams, language]);

  useEffect(() => {
    if (!isCreatorMissingPaymentInfo) {
      hasLockedToPaymentInfoRef.current = false;
      return;
    }

    const currentView = getCanonicalParam(searchParams ?? undefined, VIEW);
    const onPaymentInfo = currentView === CREATORS_LABELS.PROFILE;

    if (onPaymentInfo) {
      hasLockedToPaymentInfoRef.current = true;
      return;
    }

    // After the first lock, any attempt to leave should warn.
    if (hasLockedToPaymentInfoRef.current) {
      warnAddPaymentInfo();
    }

    redirectToPaymentInfo();
  }, [
    isCreatorMissingPaymentInfo,
    searchParams,
    redirectToPaymentInfo,
    warnAddPaymentInfo,
  ]);

  const handleSelect = useCallback(
    (label: string) => {
      if (isCreatorMissingPaymentInfo) {
        warnAddPaymentInfo();
        redirectToPaymentInfo();
        return;
      }
      router.push(getHrefForView(label), { scroll: false });
    },
    [
      getHrefForView,
      router,
      isCreatorMissingPaymentInfo,
      redirectToPaymentInfo,
      warnAddPaymentInfo,
    ],
  );

  const renderContent = useMemo(() => {
    if (view === CREATORS_LABELS.PROFILE) return <CreatorProfile />;
    if (activePage === CREATORS_LABELS.OVERVIEW) return <OverviewContent />;
    if (activePage === CREATORS_LABELS.SETTINGS) return <SettingsContent />;
    if (activePage === CREATORS_LABELS.CONTENTS) return <CreatorsContents />;
    if (activePage === CREATORS_LABELS.USERS) return <UsersContent />;
    return <div style={{ padding: 20 }}>Content for {activePage}</div>;
  }, [activePage, view]);

  if (!isReady) {
    return (
      <CreatorChannelLayoutProvider>
        <DashboardLayout
          header={<DashboardHeader role={ROLE_CREATOR} />}
          sidebarExpanded={false}
          sidebar={<Sidebar expanded={false} />}
        />
      </CreatorChannelLayoutProvider>
    );
  }

  return (
    <CreatorChannelLayoutProvider>
      <DashboardLayout
        header={renderHeader()}
        inert={upgradeRequired}
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
          visible={showLogoutModal && !upgradeRequired}
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
      <GenericModal
        visible={upgradeRequired}
        title={
          assignedPaidPlan
            ? t("dashboard.subscriptionPaymentRequired.title")
            : t("dashboard.subscriptionExpired.title")
        }
        icon={
          <UpgradeIcon>
            <CardIcon width={30} height={30} />
          </UpgradeIcon>
        }
        confirmLabel={
          assignedPaidPlan
            ? t("dashboard.subscriptionPaymentRequired.pay")
            : t("dashboard.subscriptionExpired.upgrade")
        }
        onConfirm={() => {
          window.sessionStorage.setItem(SCROLL_TO_PLANS_KEY, "1");
          router.push(localizeHref(PATHS.PRICING), { scroll: false });
        }}
        size="sm"
        maxHeight="85dvh"
        borderRadius="24px"
        fullWidthButtons
        textAlign="center"
        showCloseButton={false}
      >
        <UpgradeDescription $use="Body_Medium">
          {assignedPaidPlan
            ? t("dashboard.subscriptionPaymentRequired.message", {
                planName: assignedPaidPlan.name,
              })
            : t("dashboard.subscriptionExpired.message")}
        </UpgradeDescription>
      </GenericModal>
    </CreatorChannelLayoutProvider>
  );
}
