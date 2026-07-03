"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import PlanCard from "./PlanCard";
import { CardsWrapper, Section, SectionTitle } from "./styles";
import { planOrder, pricingPlanToPlanName } from "@/utils/pricingPlanKeys";
import ScrollReveal from "@/components/UI/ScrollReveal";
import { LANDING_REVEAL } from "@/utils/landingUtils";
import { useGetAPI } from "@/lib/http/api/getApi";
import { API } from "@/lib/http/api/endpoints";
import { useStoredLoginUser } from "@/hooks/auth/useStoredLoginUser";

type ApiPlan = {
  id: string;
  name: string;
  price: number;
  currency: string;
  billingCycle: string;
  maxFiles: number;
  isActive: boolean;
};

type PlansResponse = {
  success: boolean;
  data?: ApiPlan[];
};

type CreatorPlanResponse = {
  success: boolean;
  data?: ApiPlan[];
};

type PricingPlansSectionProps = {
  titleKey?: string;
};

export default function PricingPlansSection({
  titleKey = "pricingPlans.title",
}: PricingPlansSectionProps) {
  const { t } = useTranslation();
  const user = useStoredLoginUser();

  const { data: plansData } = useGetAPI<PlansResponse>(API.subscription.plans);
  const { data: creatorPlanData } = useGetAPI<CreatorPlanResponse>(
    API.subscription.creatorPlan,
    undefined,
    { enabled: !!user?.id },
  );

  const apiPlans = useMemo(() => plansData?.data ?? [], [plansData]);
  const activePlanId = creatorPlanData?.data?.[0]?.id;

  const matchedPlans = useMemo(() => {
    return planOrder.map((planKey) => {
      const planName = pricingPlanToPlanName[planKey];
      const apiPlan = apiPlans.find(
        (p) => p.name.toLowerCase() === planName.toLowerCase(),
      );
      return { planKey, apiPlan };
    });
  }, [apiPlans]);

  return (
    <Section>
      <ScrollReveal delay={LANDING_REVEAL.shortDelay}>
        <SectionTitle>{t(titleKey)}</SectionTitle>
      </ScrollReveal>
      <CardsWrapper>
        {matchedPlans.map(({ planKey, apiPlan }, index) => {
          const baseKey = `pricingPlans.plans.${planKey}`;
          const isCurrentPlan = !!apiPlan && apiPlan.id === activePlanId;

          return (
            <ScrollReveal
              key={planKey}
              delay={(index + 1) * LANDING_REVEAL.ctaCardStaggerDelay}
            >
              <PlanCard
                title={apiPlan?.name || t(`${baseKey}.title`)}
                price={
                  apiPlan ? `${apiPlan.price} kr/md` : t(`${baseKey}.price`)
                }
                descriptions={[t(`${baseKey}.desc1`), t(`${baseKey}.desc2`)]}
                features={
                  t(`${baseKey}.features`, { returnObjects: true }) as string[]
                }
                cta={
                  isCurrentPlan
                    ? t("pricingPlans.active")
                    : t("pricingPlans.cta")
                }
                highlight={planKey === planOrder[1]}
                planKey={planKey}
                planId={apiPlan?.id}
                isCurrentPlan={isCurrentPlan}
              />
            </ScrollReveal>
          );
        })}
      </CardsWrapper>
    </Section>
  );
}
