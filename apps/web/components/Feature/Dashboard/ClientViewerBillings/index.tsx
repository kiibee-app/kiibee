"use client";

import { useTranslation } from "react-i18next";
import {
  VIEWER_BILLING_HISTORY_TAB,
  VIEWER_BILLING_TABS,
  VIEWER_PAYMENT_METHODS_TAB,
  type ViewerBillingTab,
} from "@/utils/common";
import { useQuerySyncedTab } from "@/hooks/useQuerySyncedTab";
import GenericTabs from "@/components/UI/GenericTabs";
import { MonoText } from "@/components/UI/Monotext";
import {
  DeleteIcon,
  EditProfileIcon,
  PlusIcon,
  ThreeDotIcon,
} from "@/assets/icons";
import SafeImage from "@/components/UI/SafeImage";
import COLORS from "@repo/ui/colors";
import {
  CARD_BRAND_LOGOS,
  MOCK_VIEWER_BILLING_HISTORY,
  MOCK_VIEWER_PAYMENT_METHODS,
} from "@/utils/dummyData/viewerBillingMockData";
import { DASHBOARD_VIEWER_BILLINGS } from "@/utils/translationKeys";
import {
  Actions,
  AddCardButton,
  BillingHeader,
  BillingShell,
  CardIdentity,
  CardLabel,
  CardLogoWrap,
  DefaultBadge,
  ExpiryCell,
  IconButton,
  MethodRow,
  MethodsList,
  PaymentHeader,
} from "./styles";

const BILLING_TAB_QUERY_KEY = "billingTab";

export default function ClientViewerBillings() {
  const { t } = useTranslation();
  const { activeTab, setActiveTabAndQuery } =
    useQuerySyncedTab<ViewerBillingTab>({
      queryKey: BILLING_TAB_QUERY_KEY,
      defaultTab: VIEWER_PAYMENT_METHODS_TAB,
      validTabs: VIEWER_BILLING_TABS.map((tab) => tab.key),
    });

  return (
    <BillingShell>
      <BillingHeader>
        <MonoText $use="H4_SemiBold">
          {t(DASHBOARD_VIEWER_BILLINGS.title)}
        </MonoText>
        <GenericTabs
          tabs={VIEWER_BILLING_TABS.map((tab) => ({
            key: tab.key,
            label: t(tab.labelKey),
          }))}
          activeTab={activeTab}
          onTabChange={setActiveTabAndQuery}
        />
      </BillingHeader>

      {activeTab === VIEWER_BILLING_HISTORY_TAB ? (
        MOCK_VIEWER_BILLING_HISTORY.length ? (
          <MonoText $use="Body_Regular" color={COLORS.neutral.GRAY}>
            {t(DASHBOARD_VIEWER_BILLINGS.billingHistory.placeholder)}
          </MonoText>
        ) : (
          <MonoText $use="Body_Regular" color={COLORS.neutral.GRAY}>
            {t(DASHBOARD_VIEWER_BILLINGS.billingHistory.empty)}
          </MonoText>
        )
      ) : (
        <>
          <PaymentHeader>
            <MonoText $use="H4_Medium">
              {t(DASHBOARD_VIEWER_BILLINGS.paymentMethods.title)}
            </MonoText>
            <AddCardButton type="button">
              <PlusIcon width={12} height={12} />
              <MonoText $use="Body_Medium" color={COLORS.primary.WHITE}>
                {t(DASHBOARD_VIEWER_BILLINGS.paymentMethods.addCard)}
              </MonoText>
            </AddCardButton>
          </PaymentHeader>

          <MethodsList>
            {MOCK_VIEWER_PAYMENT_METHODS.map((method) => (
              <MethodRow key={method.id}>
                <CardIdentity>
                  <CardLogoWrap>
                    <SafeImage
                      src={CARD_BRAND_LOGOS[method.brand]}
                      alt={method.brand}
                      width={method.brand === "visa" ? 32 : 22}
                      height={method.brand === "visa" ? 10 : 16}
                    />
                  </CardLogoWrap>
                  <CardLabel>
                    <MonoText $use="Body_SemiBold">{method.label}</MonoText>
                    {method.isDefault ? (
                      <DefaultBadge>
                        {t(
                          DASHBOARD_VIEWER_BILLINGS.paymentMethods.defaultBadge,
                        )}
                      </DefaultBadge>
                    ) : null}
                  </CardLabel>
                </CardIdentity>

                <ExpiryCell>
                  <MonoText $use="Body_SemiBold" color={COLORS.neutral.GRAY}>
                    {t(DASHBOARD_VIEWER_BILLINGS.paymentMethods.expires, {
                      date: method.expiresAt,
                    })}
                  </MonoText>
                </ExpiryCell>

                <Actions>
                  <IconButton
                    type="button"
                    aria-label={t(
                      DASHBOARD_VIEWER_BILLINGS.paymentMethods.edit,
                    )}
                  >
                    <EditProfileIcon color={COLORS.neutral.GRAY} />
                  </IconButton>
                  <IconButton
                    type="button"
                    aria-label={t(
                      DASHBOARD_VIEWER_BILLINGS.paymentMethods.delete,
                    )}
                  >
                    <DeleteIcon color={COLORS.gredint.NEAR_BLACK} />
                  </IconButton>
                  <IconButton
                    type="button"
                    aria-label={t(
                      DASHBOARD_VIEWER_BILLINGS.paymentMethods.more,
                    )}
                  >
                    <ThreeDotIcon color={COLORS.gredint.NEAR_BLACK} />
                  </IconButton>
                </Actions>
              </MethodRow>
            ))}
          </MethodsList>
        </>
      )}
    </BillingShell>
  );
}
