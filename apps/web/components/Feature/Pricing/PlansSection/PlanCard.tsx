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
import { FREE_LABEL, VARIANT } from "@/utils/Constants";

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
  const user = useStoredLoginUser();
  const isLoggedIn = !!user;
  const { getErrorMessage } = useApiErrorMessage();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createSubscriptionMutation = usePostAPI<
    CreateSubscriptionResponse,
    CreateSubscriptionPayload
  >(API.subscription.create);

  const handlePlanClick = async () => {
    if (!isLoggedIn) {
      router.push(PATHS.AUTH_SIGNUP_CREATOR);
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
        toast.success(t("pricingPlans.subscriptionActivated"));
        return;
      }

      const paymentUrl = response?.data?.paymentWindowUrl;
      if (paymentUrl) {
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
  );
}
