"use client";

import { useTranslation } from "react-i18next";
import PlanCard from "./PlanCard";
import { CardsWrapper, Section, SectionTitle } from "./styles";
import { planOrder } from "@/utils/pricingPlanKeys";
import ScrollReveal from "@/components/UI/ScrollReveal";
import { LANDING_REVEAL } from "@/utils/landingUtils";

type PricingPlansSectionProps = {
  titleKey?: string;
};

export default function PricingPlansSection({
  titleKey = "pricingPlans.title",
}: PricingPlansSectionProps) {
  const { t } = useTranslation();

  return (
    <Section>
      <ScrollReveal delay={LANDING_REVEAL.shortDelay}>
        <SectionTitle>{t(titleKey)}</SectionTitle>
      </ScrollReveal>
      <CardsWrapper>
        {planOrder.map((planKey, index) => {
          const baseKey = `pricingPlans.plans.${planKey}`;

          return (
            <ScrollReveal
              key={planKey}
              delay={(index + 1) * LANDING_REVEAL.ctaCardStaggerDelay}
            >
              <PlanCard
                title={t(`${baseKey}.title`)}
                price={t(`${baseKey}.price`)}
                descriptions={[t(`${baseKey}.desc1`), t(`${baseKey}.desc2`)]}
                features={
                  t(`${baseKey}.features`, { returnObjects: true }) as string[]
                }
                cta={t("pricingPlans.cta")}
                highlight={planKey === "growth"}
              />
            </ScrollReveal>
          );
        })}
      </CardsWrapper>
    </Section>
  );
}
