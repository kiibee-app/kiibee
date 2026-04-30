"use client";

import Image from "@/components/UI/SafeImage";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "styled-components";
import { BackButtonIcon } from "@/assets/icons";
import logo from "@/assets/icons/Kiibee_logo_mark_black.svg";
import { subscriptionPlans } from "@/utils/subscriptionPlans";
import SubscriptionDetailsForm from "./SubscriptionDetailsForm";
import SubscriptionPlanStep from "./SubscriptionPlanStep";
import {
  BackActionButton,
  BackRow,
  Content,
  SubscriptionPageInner,
  SubscriptionShell,
} from "./styles";

export default function SubscriptionSection() {
  const { t } = useTranslation();
  const theme = useTheme();
  const [selectedPlan, setSelectedPlan] = useState(subscriptionPlans[1].id);
  const [currentStep, setCurrentStep] = useState<"plan" | "details">("plan");
  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    repeatPassword: false,
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const isSubmitEnabled =
    Boolean(email.trim()) &&
    Boolean(password.trim()) &&
    Boolean(repeatPassword.trim());

  const getPlanPriceLabel = (planId: string) => {
    const plan = subscriptionPlans.find((item) => item.id === planId);
    return plan ? t(plan.priceKey) : "";
  };

  const handleContinue = () => {
    if (currentStep === "plan") {
      setCurrentStep("details");
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };
  const handleTogglePasswordVisibility = (
    key: "password" | "repeatPassword",
  ) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <SubscriptionShell>
      <SubscriptionPageInner>
        {currentStep === "details" && (
          <BackRow>
            <BackActionButton
              type="button"
              onClick={() => setCurrentStep("plan")}
              aria-label={t("common.back")}
            >
              <BackButtonIcon
                size={40}
                backgroundColor={theme.colors.neutral.GRAY_200}
                strokeColor={theme.colors.primary.BLACK}
              />
            </BackActionButton>
          </BackRow>
        )}

        <Content>
          <Image
            src={logo}
            alt={t("subscriptionPage.logoAlt")}
            width={42}
            height={42}
          />

          {currentStep === "plan" ? (
            <SubscriptionPlanStep
              selectedPlan={selectedPlan}
              onSelectPlan={setSelectedPlan}
              onContinue={handleContinue}
              t={t}
            />
          ) : (
            <SubscriptionDetailsForm
              selectedPlan={selectedPlan}
              onSelectPlan={setSelectedPlan}
              email={email}
              password={password}
              repeatPassword={repeatPassword}
              onEmailChange={setEmail}
              onPasswordChange={setPassword}
              onRepeatPasswordChange={setRepeatPassword}
              passwordVisibility={passwordVisibility}
              onTogglePasswordVisibility={handleTogglePasswordVisibility}
              isSubmitEnabled={isSubmitEnabled}
              getPlanPriceLabel={getPlanPriceLabel}
              onSubmit={handleSubmit}
              t={t}
            />
          )}
        </Content>
      </SubscriptionPageInner>
    </SubscriptionShell>
  );
}
