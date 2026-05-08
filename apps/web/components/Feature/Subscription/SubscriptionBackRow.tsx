import { useTranslation } from "react-i18next";
import { useTheme } from "styled-components";
import { BackButtonIcon } from "@/assets/icons";
import { COMMON } from "@/utils/translationKeys";
import { BackActionButton, BackRow } from "./styles";
import type { SubscriptionStep } from "@/types/subscription";
import { BUTTON, SUBSCRIPTION_STEP } from "@/utils/Constants";

interface SubscriptionBackRowProps {
  currentStep: SubscriptionStep;
  onBack: (step: SubscriptionStep) => void;
}

export default function SubscriptionBackRow({
  currentStep,
  onBack,
}: SubscriptionBackRowProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  const getTargetStep = (): SubscriptionStep | null => {
    if (currentStep === SUBSCRIPTION_STEP.DETAILS) {
      return SUBSCRIPTION_STEP.PLAN;
    }
    if (currentStep === SUBSCRIPTION_STEP.PAYMENT) {
      return SUBSCRIPTION_STEP.DETAILS;
    }
    return null;
  };

  const targetStep = getTargetStep();

  if (!targetStep) return null;

  return (
    <BackRow>
      <BackActionButton
        type={BUTTON}
        onClick={() => onBack(targetStep)}
        aria-label={t(COMMON.back)}
      >
        <BackButtonIcon
          size={40}
          backgroundColor={theme.colors.neutral.GRAY_200}
          strokeColor={theme.colors.primary.BLACK}
        />
      </BackActionButton>
    </BackRow>
  );
}
