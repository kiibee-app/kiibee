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
import { MonoText } from "@/components/UI/Monotext";
import COLORS from "@repo/ui/colors";
import { ALERT } from "@/utils/common";

function SubscriptionSectionInner() {
  const { t } = useTranslation();
  const {
    currentStep,
    setCurrentStep,
    inviteTokenError,
    inviteSubmitError,
    isCreatorInviteFlow,
    backFromPaymentStep,
  } = useSubscriptionContext();

  const showInviteSubmitError =
    isCreatorInviteFlow &&
    Boolean(inviteSubmitError) &&
    (currentStep === SUBSCRIPTION_STEP.DETAILS ||
      currentStep === SUBSCRIPTION_STEP.PAYMENT);

  return (
    <SubscriptionShell>
      <SubscriptionPageInner>
        <SubscriptionBackRow
          currentStep={currentStep}
          onBack={setCurrentStep}
          onPaymentBack={backFromPaymentStep}
        />

        <Content>
          <Image
            src={logo}
            alt={t(SUBSCRIPTION.logoAlt)}
            width={42}
            height={42}
          />

          {inviteTokenError ? (
            <MonoText
              $use="Body_Regular"
              role={ALERT}
              style={{
                color: COLORS.primary.RED,
                textAlign: "center",
                maxWidth: 420,
              }}
            >
              {inviteTokenError}
            </MonoText>
          ) : null}

          {showInviteSubmitError ? (
            <MonoText
              $use="Body_Regular"
              role={ALERT}
              style={{
                color: COLORS.primary.RED,
                textAlign: "center",
                maxWidth: 420,
              }}
            >
              {inviteSubmitError}
            </MonoText>
          ) : null}

          {!inviteTokenError && currentStep === SUBSCRIPTION_STEP.PLAN ? (
            <SubscriptionPlanStep />
          ) : null}
          {!inviteTokenError && currentStep === SUBSCRIPTION_STEP.DETAILS ? (
            <SubscriptionDetailsForm />
          ) : null}
          {!inviteTokenError && currentStep === SUBSCRIPTION_STEP.PAYMENT ? (
            <SubscriptionPaymentStep />
          ) : null}
        </Content>
      </SubscriptionPageInner>
    </SubscriptionShell>
  );
}

export default function SubscriptionSection({
  setupToken,
}: {
  setupToken?: string | null;
}) {
  return (
    <SubscriptionProvider setupToken={setupToken}>
      <SubscriptionSectionInner />
    </SubscriptionProvider>
  );
}
