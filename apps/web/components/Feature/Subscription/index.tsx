"use client";

import Image from "@/components/UI/SafeImage";
import { useTranslation } from "react-i18next";
import logo from "@/assets/icons/Kiibee_logo_mark_black.svg";
import { SUBSCRIPTION_STEP } from "@/utils/Constants";
import { SUBSCRIPTION } from "@/utils/translationKeys";
import SubscriptionDetailsForm from "./SubscriptionDetailsForm";
import SubscriptionPaymentStep from "./SubscriptionPaymentStep";
import SubscriptionPlanStep from "./SubscriptionPlanStep";
import SubscriptionBackRow from "./SubscriptionBackRow";
import {
  SubscriptionProvider,
  useSubscriptionContext,
} from "@/providers/subscriptionProvider";
import { Content, SubscriptionPageInner, SubscriptionShell } from "./styles";

function SubscriptionSectionInner() {
  const { t } = useTranslation();
  const { currentStep, setCurrentStep } = useSubscriptionContext();

  return (
    <SubscriptionShell>
      <SubscriptionPageInner>
        <SubscriptionBackRow
          currentStep={currentStep}
          onBack={setCurrentStep}
        />

        <Content>
          <Image
            src={logo}
            alt={t(SUBSCRIPTION.logoAlt)}
            width={42}
            height={42}
          />

          {currentStep === SUBSCRIPTION_STEP.PLAN && <SubscriptionPlanStep />}
          {currentStep === SUBSCRIPTION_STEP.DETAILS && (
            <SubscriptionDetailsForm />
          )}
          {currentStep === SUBSCRIPTION_STEP.PAYMENT && (
            <SubscriptionPaymentStep />
          )}
        </Content>
      </SubscriptionPageInner>
    </SubscriptionShell>
  );
}

export default function SubscriptionSection() {
  return (
    <SubscriptionProvider>
      <SubscriptionSectionInner />
    </SubscriptionProvider>
  );
}
