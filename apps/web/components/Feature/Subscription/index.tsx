"use client";

import Image from "@/components/UI/SafeImage";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import logo from "@/assets/icons/Kiibee_logo_mark_black.svg";
import { subscriptionPlans } from "@/utils/subscriptionPlans";
import {
  CompareLink,
  ContinueButton,
  Heading,
  PlanInfo,
  PlanList,
  PlanMeta,
  PlanName,
  PlanNameRow,
  PlanOption,
  PlanPrice,
  Radio,
  SubscriptionCard,
  SubscriptionShell,
} from "./styles";

export default function SubscriptionSection() {
  const { t } = useTranslation();
  const [selectedPlan, setSelectedPlan] = useState(subscriptionPlans[1].id);

  return (
    <SubscriptionShell>
      <SubscriptionCard>
        <Image
          src={logo}
          alt={t("subscriptionPage.logoAlt")}
          width={42}
          height={42}
          priority
        />

        <Heading>{t("subscriptionPage.title")}</Heading>

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

        <CompareLink href="/pricing">
          {t("subscriptionPage.comparePlans")}
        </CompareLink>

        <ContinueButton type="button">
          {t("subscriptionPage.continue")}
        </ContinueButton>
      </SubscriptionCard>
    </SubscriptionShell>
  );
}
