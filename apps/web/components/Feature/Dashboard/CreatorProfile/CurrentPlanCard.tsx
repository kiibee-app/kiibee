"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { MonoText } from "@/components/UI/Monotext";
import GenericButton from "@/components/UI/GenericButton";
import { VARIANT } from "@/utils/Constants";
import { PATHS } from "@/utils/path";
import { useGetAPI } from "@/lib/http/api/getApi";
import { API } from "@/lib/http/api/endpoints";
import { CREATOR_PROFILE } from "@/utils/translationKeys";
import { FRESH_QUERY_OPTIONS } from "@/utils/common";
import {
  PlanCardRoot,
  PlanCardHeader,
  PlanCardLabel,
  PlanStatusBadge,
  PlanCardName,
  PlanCardMeta,
  PlanMetaChip,
  PlanCardActions,
} from "./styles";

type ApiPlan = {
  id: string;
  name: string;
  price: number;
  currency: string;
  billingCycle: string;
  maxFiles: number;
  isActive: boolean;
};

type CreatorPlanResponse = {
  success: boolean;
  data?: ApiPlan[];
};

export default function CurrentPlanCard() {
  const { t } = useTranslation();
  const router = useRouter();

  const { data: creatorPlanData, isLoading } = useGetAPI<CreatorPlanResponse>(
    API.subscription.creatorPlan,
    undefined,
    FRESH_QUERY_OPTIONS,
  );

  const currentPlan = creatorPlanData?.data?.[0];

  const displayName =
    currentPlan?.name?.trim() || t(CREATOR_PROFILE.currentPlan.fallbackName);

  const priceLabel = useMemo(() => {
    if (!currentPlan) {
      return null;
    }
    return t(CREATOR_PROFILE.currentPlan.pricePerMonth, {
      price: currentPlan.price,
    });
  }, [currentPlan, t]);

  const isFreePlan = (currentPlan?.price ?? 0) === 0;
  const ctaLabel = isFreePlan
    ? t(CREATOR_PROFILE.currentPlan.upgrade)
    : t(CREATOR_PROFILE.currentPlan.changePlan);

  const handleUpgrade = () => {
    router.push(PATHS.PRICING_PLANS);
  };

  return (
    <PlanCardRoot>
      <PlanCardHeader>
        <PlanCardLabel>
          <MonoText $use="Body_Medium">
            {t(CREATOR_PROFILE.currentPlan.label)}
          </MonoText>
        </PlanCardLabel>
        <PlanStatusBadge>
          {t(CREATOR_PROFILE.currentPlan.activeBadge)}
        </PlanStatusBadge>
      </PlanCardHeader>

      <PlanCardName>
        <MonoText $use="Heading3">
          {isLoading ? t(CREATOR_PROFILE.currentPlan.loading) : displayName}
        </MonoText>
      </PlanCardName>

      {priceLabel && !isLoading ? (
        <PlanCardMeta>
          <PlanMetaChip>{priceLabel}</PlanMetaChip>
          {typeof currentPlan?.maxFiles === "number" ? (
            <PlanMetaChip>
              {t(CREATOR_PROFILE.currentPlan.maxFiles, {
                count: currentPlan.maxFiles,
              })}
            </PlanMetaChip>
          ) : null}
        </PlanCardMeta>
      ) : null}

      <PlanCardActions>
        <GenericButton
          variant={VARIANT.PRIMARY}
          onClick={handleUpgrade}
          disabled={isLoading}
        >
          {ctaLabel}
        </GenericButton>
      </PlanCardActions>
    </PlanCardRoot>
  );
}
