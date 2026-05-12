"use client";

import { useTranslation } from "react-i18next";
import { subscriptionPlans } from "@/utils/subscriptionPlans";
import { PATHS } from "@/utils/path";
import { SUBSCRIPTION } from "@/utils/translationKeys";
import { useSubscriptionContext } from "@/providers/subscriptionProvider";
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
import { BUTTON } from "@/utils/Constants";

export default function SubscriptionPlanStep() {
  const { t } = useTranslation();
  const { selectedPlan, setSelectedPlan, handleContinue } =
    useSubscriptionContext();

  return (
    <>
      <Header>
        <Title>{t(SUBSCRIPTION.title)}</Title>
      </Header>

      <PlanList>
        {subscriptionPlans.map((plan) => {
          const selected = selectedPlan === plan.id;

          return (
            <PlanOption
              key={plan.id}
              type="button"
              $selected={selected}
              onClick={() => setSelectedPlan(plan.id)}
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
        {t(SUBSCRIPTION.comparePlans)}
      </CompareLink>

      <FullWidthContinueButton type={BUTTON} onClick={handleContinue}>
        {t(SUBSCRIPTION.continue)}
      </FullWidthContinueButton>
    </>
  );
}
