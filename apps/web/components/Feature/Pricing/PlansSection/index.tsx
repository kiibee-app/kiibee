"use client";

import { useEffect, useMemo, useSyncExternalStore } from "react";
import { useTranslation } from "react-i18next";
import PlanCard from "./PlanCard";
import { CardsWrapper, Section, SectionTitle } from "./styles";
import { planOrder, pricingPlanToPlanName } from "@/utils/pricingPlanKeys";
import ScrollReveal from "@/components/UI/ScrollReveal";
import { LANDING_REVEAL } from "@/utils/landingUtils";
import { useGetAPI } from "@/lib/http/api/getApi";
import { API } from "@/lib/http/api/endpoints";
import { useStoredLoginUser } from "@/hooks/auth/useStoredLoginUser";

const PLANS_SECTION_ID = "plans";
const PLANS_HASH = `#${PLANS_SECTION_ID}`;

function subscribeToHash(onStoreChange: () => void) {
  window.addEventListener("hashchange", onStoreChange);
  return () => window.removeEventListener("hashchange", onStoreChange);
}

function getPlansHashSnapshot() {
  return window.location.hash === PLANS_HASH;
}

function getPlansHashServerSnapshot() {
  return false;
}

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
  const isFocusedFromUpgrade = useSyncExternalStore(
    subscribeToHash,
    getPlansHashSnapshot,
    getPlansHashServerSnapshot,
  );

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

  useEffect(() => {
    if (!isFocusedFromUpgrade) return;

    const scrollToPlans = () => {
      document
        .getElementById(PLANS_SECTION_ID)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const frame = window.requestAnimationFrame(scrollToPlans);
    const timeout = window.setTimeout(scrollToPlans, 150);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
    };
  }, [isFocusedFromUpgrade]);

  const title = <SectionTitle>{t(titleKey)}</SectionTitle>;

  return (
    <Section
      id={PLANS_SECTION_ID}
      $focused={isFocusedFromUpgrade}
      aria-current={isFocusedFromUpgrade ? "true" : undefined}
    >
      {isFocusedFromUpgrade ? (
        title
      ) : (
        <ScrollReveal delay={LANDING_REVEAL.shortDelay}>{title}</ScrollReveal>
      )}
      <CardsWrapper>
        {matchedPlans.map(({ planKey, apiPlan }, index) => {
          const baseKey = `pricingPlans.plans.${planKey}`;
          const isCurrentPlan = !!apiPlan && apiPlan.id === activePlanId;

          const card = (
            <PlanCard
              title={apiPlan?.name || t(`${baseKey}.title`)}
              price={apiPlan ? `${apiPlan.price} kr/md` : t(`${baseKey}.price`)}
              descriptions={[t(`${baseKey}.desc1`), t(`${baseKey}.desc2`)]}
              features={
                t(`${baseKey}.features`, { returnObjects: true }) as string[]
              }
              cta={
                isCurrentPlan ? t("pricingPlans.active") : t("pricingPlans.cta")
              }
              highlight={planKey === planOrder[1]}
              planKey={planKey}
              planId={apiPlan?.id}
              isCurrentPlan={isCurrentPlan}
            />
          );

          if (isFocusedFromUpgrade) {
            return <div key={planKey}>{card}</div>;
          }

          return (
            <ScrollReveal
              key={planKey}
              delay={(index + 1) * LANDING_REVEAL.ctaCardStaggerDelay}
            >
              {card}
            </ScrollReveal>
          );
        })}
      </CardsWrapper>
    </Section>
  );
}
