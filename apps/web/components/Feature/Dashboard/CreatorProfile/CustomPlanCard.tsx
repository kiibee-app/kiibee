"use client";

import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import GenericButton from "@/components/UI/GenericButton";
import { VARIANT } from "@/utils/Constants";
import { useStoredLoginUser } from "@/hooks/auth/useStoredLoginUser";
import { usePostAPI } from "@/lib/http/api/postApi";
import { API } from "@/lib/http/api/endpoints";
import { useApiErrorMessage } from "@/lib/http/useApiErrorMessage";
import {
  CustomPlanRoot,
  CustomPlanEyebrow,
  CustomPlanTitle,
  CustomPlanPrice,
  CustomPlanDescription,
  CustomPlanDetails,
  CustomPlanNote,
  PlanCardActions,
} from "./styles";

type Props = {
  plan: {
    id: string;
    name: string;
    price: number;
    currency: string;
    maxFiles: number;
    hasCustomBilling?: boolean;
    customSubscriptionStatus?: string;
    subscriptionUpgradeRequired?: boolean;
    billingOptions?: { months: number; amount: number }[];
    customKiibeeCutDkk?: number | null;
    customTransactionFeePct?: number | null;
  };
};

export default function CustomPlanCard({ plan }: Props) {
  const { t } = useTranslation();
  const user = useStoredLoginUser();
  const { getErrorMessage } = useApiErrorMessage();
  const options = plan.billingOptions ?? [{ months: 1, amount: plan.price }];
  const selected = options[0];
  const currency = ["KR", "DK"].includes(plan.currency)
    ? "DKK"
    : plan.currency || "DKK";
  const checkout = usePostAPI<
    { success: boolean; data?: { paymentWindowUrl?: string } },
    { userId: string; planId: string; billingMonths: number }
  >(API.subscription.create);
  const setupPayment = async () => {
    if (!user?.id || !selected) return;
    try {
      const response = await checkout.mutateAsync({
        userId: user.id,
        planId: plan.id,
        billingMonths: selected.months,
      });
      if (!response.success || !response.data?.paymentWindowUrl)
        throw new Error(t("customSubscription.checkoutError"));
      window.location.assign(response.data.paymentWindowUrl);
    } catch (error) {
      toast.error(getErrorMessage(error, "customSubscription.checkoutError"));
    }
  };
  return (
    <CustomPlanRoot
      id="creator-custom-plan"
      aria-label={t("customSubscription.title")}
    >
      <CustomPlanEyebrow>{t("customSubscription.title")}</CustomPlanEyebrow>
      <CustomPlanTitle>{plan.name}</CustomPlanTitle>
      {plan.customSubscriptionStatus === "pending" && (
        <CustomPlanDescription>
          {t("customSubscription.pending")}
        </CustomPlanDescription>
      )}
      <CustomPlanPrice>
        {selected?.amount ?? plan.price}
        <span>{currency}</span>
      </CustomPlanPrice>
      <CustomPlanDescription>
        {t("pricingPlans.billingMonths", { count: selected?.months ?? 1 })}
      </CustomPlanDescription>
      <CustomPlanDetails>
        <span>
          {t("creatorProfile.currentPlan.maxFiles", { count: plan.maxFiles })}
        </span>
        {plan.customKiibeeCutDkk != null && (
          <span>
            {t("customSubscription.fixedFee", {
              amount: plan.customKiibeeCutDkk,
            })}
          </span>
        )}
        {plan.customTransactionFeePct != null && (
          <span>
            {t("customSubscription.processingFee", {
              percent: plan.customTransactionFeePct,
            })}
          </span>
        )}
      </CustomPlanDetails>
      {plan.customSubscriptionStatus === "paid" && (
        <PlanCardActions>
          <GenericButton variant={VARIANT.PRIMARY} disabled>
            {t("customSubscription.activated")}
          </GenericButton>
        </PlanCardActions>
      )}
      {plan.price > 0 &&
        (["draft", "pending"].includes(plan.customSubscriptionStatus ?? "") ||
          (plan.customSubscriptionStatus == null && plan.hasCustomBilling) ||
          (plan.customSubscriptionStatus !== "draft" &&
            plan.subscriptionUpgradeRequired)) && (
          <>
            <CustomPlanNote>{t("customSubscription.setupNote")}</CustomPlanNote>
            <PlanCardActions>
              <GenericButton
                variant={VARIANT.PRIMARY}
                onClick={setupPayment}
                disabled={checkout.isPending || !user?.id}
                isLoading={checkout.isPending}
              >
                {t("customSubscription.payAndActivate")}
              </GenericButton>
            </PlanCardActions>
          </>
        )}
    </CustomPlanRoot>
  );
}
