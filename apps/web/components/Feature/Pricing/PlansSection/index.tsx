"use client";

import { useTranslation } from "react-i18next";
import PlanCard from "./PlanCard";
import { CardsWrapper, Section, SectionTitle } from "./styles";
import { planOrder } from "@/utils/pricingPlanKeys";

type PricingPlansSectionProps = {
  titleKey?: string;
};

export default function PricingPlansSection({
  titleKey = "pricingPlans.title",
}: PricingPlansSectionProps) {
  const { t } = useTranslation();

  return (
    <Section>
      <SectionTitle>{t(titleKey)}</SectionTitle>
      <CardsWrapper>
        {planOrder.map((planKey) => {
          const baseKey = `pricingPlans.plans.${planKey}`;

          return (
            <PlanCard
              key={planKey}
              title={t(`${baseKey}.title`)}
              price={t(`${baseKey}.price`)}
              desc1={t(`${baseKey}.desc1`)}
              desc2={t(`${baseKey}.desc2`)}
              features={
                t(`${baseKey}.features`, { returnObjects: true }) as string[]
              }
              cta={t("pricingPlans.cta")}
              highlight={planKey === "growth"}
            />
          );
        })}
      </CardsWrapper>
    </Section>
  );
}
