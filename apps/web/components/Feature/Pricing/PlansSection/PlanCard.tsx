"use client";

import { useState } from "react";
import {
  Card,
  Description,
  Divider,
  FeatureItem,
  FeatureList,
  FeatureText,
  PlanButton,
  PlanPrice,
  PlanTitle,
  TickIcon,
} from "./styles";
import { PATHS } from "@/utils/path";
import { useRouter } from "next/navigation";
import { useStoredLoginUser } from "@/hooks/auth/useStoredLoginUser";
import { usePostAPI } from "@/lib/http/api/postApi";
import { API } from "@/lib/http/api/endpoints";
import { toast } from "react-toastify";
import { useApiErrorMessage } from "@/lib/http/useApiErrorMessage";
import type { PlanKey } from "@/utils/pricingPlanKeys";
import { useTranslation } from "react-i18next";
import {
  ACTION_LOGIN,
  ACTION_SIGNUP,
  FREE_LABEL,
  REDIRECT_NEXT_QUERY_PARAM,
  ROLE_CREATOR,
  UNDEFINED_STRING,
  VARIANT,
} from "@/utils/Constants";
import { useQueryClient } from "@tanstack/react-query";
import { GenericModal } from "@/components/UI/Modals";
import { useLogout } from "@/hooks/auth/useLogout";

type CreateSubscriptionResponse = {
  success: boolean;
  data?: {
    paymentWindowUrl?: string;
  };
  type?: string;
  message?: string;
};

type CreateSubscriptionPayload = {
  userId: string;
  planId: string;
};

export interface PlanCardProps {
  title: string;
  price: string;
  descriptions: string[];
  features: string[];
  cta: string;
  highlight?: boolean;
  planKey?: PlanKey;
  planId?: string;
  isCurrentPlan?: boolean;
}

export default function PlanCard({
  title,
  price,
  descriptions,
  features,
  cta,
  highlight = false,
  planId,
  isCurrentPlan = false,
}: PlanCardProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const user = useStoredLoginUser();
  const isLoggedIn = !!user;
  const { getErrorMessage } = useApiErrorMessage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [authAction, setAuthAction] = useState<
    typeof ACTION_LOGIN | typeof ACTION_SIGNUP | null
  >(null);
  const { logout, isPending: isLoggingOut } = useLogout();

  const createSubscriptionMutation = usePostAPI<
    CreateSubscriptionResponse,
    CreateSubscriptionPayload
  >(API.subscription.create);

  const invalidateCreatorPlan = () =>
    queryClient.invalidateQueries({
      queryKey: [API.subscription.creatorPlan],
    });

  const confirmAuthRedirect = async () => {
    if (!authAction) return;
    const returnUrl =
      typeof window !== UNDEFINED_STRING
        ? window.location.pathname + window.location.search
        : "";
    const targetPath =
      authAction === ACTION_SIGNUP
        ? PATHS.AUTH_SIGNUP_CREATOR
        : PATHS.AUTH_LOGIN;
    await logout(
      `${targetPath}?${REDIRECT_NEXT_QUERY_PARAM}=${encodeURIComponent(returnUrl)}`,
    );
  };

  const handlePlanClick = async () => {
    if (!isLoggedIn) {
      router.push(PATHS.AUTH_SIGNUP_CREATOR);
      return;
    }

    if (user?.role !== ROLE_CREATOR) {
      setShowNoticeModal(true);
      return;
    }

    if (!user?.id || !planId) {
      toast.error(t("pricingPlans.planNotFound"));
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await createSubscriptionMutation.mutateAsync({
        userId: user.id,
        planId,
      });

      if (response.type?.toLowerCase() === FREE_LABEL) {
        await invalidateCreatorPlan();
        toast.success(t("pricingPlans.subscriptionActivated"));
        return;
      }

      const paymentUrl = response?.data?.paymentWindowUrl;
      if (paymentUrl) {
        await invalidateCreatorPlan();
        window.location.assign(paymentUrl);
      }
    } catch (error) {
      const message = getErrorMessage(error, "errors.saveChangesFailed");
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Card $highlight={highlight}>
        <PlanTitle>{title}</PlanTitle>
        <Divider />
        <PlanPrice>{price}</PlanPrice>

        {descriptions.map((desc, i) => (
          <Description key={i}>{desc}</Description>
        ))}

        <FeatureList>
          {features.map((feature) => (
            <FeatureItem key={feature}>
              <TickIcon aria-hidden="true" />
              <FeatureText>{feature}</FeatureText>
            </FeatureItem>
          ))}
        </FeatureList>

        <PlanButton
          type="button"
          variant={isCurrentPlan ? VARIANT.SECONDARY : VARIANT.PRIMARY}
          onClick={isCurrentPlan ? undefined : handlePlanClick}
          disabled={isSubmitting || isCurrentPlan}
          isLoading={isSubmitting}
        >
          {cta}
        </PlanButton>
      </Card>

      <GenericModal
        visible={showNoticeModal}
        onClose={() => setShowNoticeModal(false)}
        title={t("viewerSubscriptionFlow.modal1.title")}
        message={t("viewerSubscriptionFlow.modal1.message")}
        confirmLabel={t("viewerSubscriptionFlow.modal1.primaryBtn")}
        cancelLabel={t("viewerSubscriptionFlow.modal1.secondaryBtn")}
        onConfirm={() => setAuthAction(ACTION_LOGIN)}
        onCancel={() => setAuthAction(ACTION_SIGNUP)}
        buttonRow={false}
        fullWidthButtons
      />

      <GenericModal
        visible={Boolean(authAction)}
        onClose={() => setAuthAction(null)}
        title={t("viewerSubscriptionFlow.modal2.title")}
        confirmLabel={t("viewerSubscriptionFlow.modal2.primaryBtn")}
        cancelLabel={t("viewerSubscriptionFlow.modal2.secondaryBtn")}
        onConfirm={confirmAuthRedirect}
        onCancel={() => {
          setAuthAction(null);
          setShowNoticeModal(true);
        }}
        confirmLoading={isLoggingOut}
        confirmDisabled={isLoggingOut}
        buttonRow={true}
        fullWidthButtons
        closeOnConfirm={false}
      />
    </>
  );
}
