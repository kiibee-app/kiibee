"use client";

import { subscriptionPlans } from "@/utils/subscriptionPlans";
import { PATHS } from "@/utils/path";
import {
  CompareLink,
  FullWidthContinueButton,
  Header,
  PlanInfo,
  PlanList,
  PlanMeta,
  PlanName,
  PlanNameRow,
  PlanOption,
  PlanPrice,
  Radio,
  Title,
} from "./styles";

type SubscriptionPlanStepProps = {
  selectedPlan: string;
  onSelectPlan: (planId: string) => void;
  onContinue: () => void;
  t: (key: string) => string;
};

export default function SubscriptionPlanStep({
  selectedPlan,
  onSelectPlan,
  onContinue,
  t,
}: SubscriptionPlanStepProps) {
  return (
    <>
      <Header>
        <Title>{t("subscriptionPage.title")}</Title>
      </Header>

      <PlanList>
        {subscriptionPlans.map((plan) => {
          const selected = selectedPlan === plan.id;

          return (
            <PlanOption
              key={plan.id}
              type="button"
              $selected={selected}
              onClick={() => onSelectPlan(plan.id)}
              aria-pressed={selected}
            >
              <Radio $selected={selected} aria-hidden="true" />
              <PlanInfo>
                <PlanNameRow>
                  <PlanName>{t(plan.nameKey)}</PlanName>
                  <PlanPrice>{t(plan.priceKey)}</PlanPrice>
                </PlanNameRow>
                <PlanMeta>{t(plan.metaKey)}</PlanMeta>
              </PlanInfo>
            </PlanOption>
          );
        })}
      </PlanList>

      <CompareLink href={PATHS.PRICING}>
        {t("subscriptionPage.comparePlans")}
      </CompareLink>

      <FullWidthContinueButton type="button" onClick={onContinue}>
        {t("subscriptionPage.continue")}
      </FullWidthContinueButton>
    </>
  );
}
