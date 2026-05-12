import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  PASSWORD_VISIBILITY_KEY,
  SUBSCRIPTION_STEP,
  type PasswordVisibilityKey,
} from "@/utils/Constants";
import { subscriptionPlans } from "@/utils/subscriptionPlans";
import type {
  SubscriptionContextValue,
  SubscriptionStep,
} from "@/types/subscription";

export const useSubscriptionFlow = (): SubscriptionContextValue => {
  const { t } = useTranslation();
  const [selectedPlan, setSelectedPlan] = useState(subscriptionPlans[1].id);
  const [currentStep, setCurrentStep] = useState<SubscriptionStep>(
    SUBSCRIPTION_STEP.PLAN,
  );
  const [passwordVisibility, setPasswordVisibility] = useState({
    [PASSWORD_VISIBILITY_KEY.PASSWORD]: false,
    [PASSWORD_VISIBILITY_KEY.REPEAT_PASSWORD]: false,
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
    if (currentStep === SUBSCRIPTION_STEP.PLAN) {
      setCurrentStep(SUBSCRIPTION_STEP.DETAILS);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCurrentStep(SUBSCRIPTION_STEP.PAYMENT);
  };

  const handleTogglePasswordVisibility = (key: PasswordVisibilityKey) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return {
    selectedPlan,
    currentStep,
    passwordVisibility,
    email,
    password,
    repeatPassword,
    isSubmitEnabled,
    setSelectedPlan,
    setCurrentStep,
    handleContinue,
    handleSubmit,
    handleTogglePasswordVisibility,
    setEmail,
    setPassword,
    setRepeatPassword,
    getPlanPriceLabel,
    onSelectPlan: setSelectedPlan,
    onEmailChange: setEmail,
    onPasswordChange: setPassword,
    onRepeatPasswordChange: setRepeatPassword,
    onTogglePasswordVisibility: handleTogglePasswordVisibility,
    onSubmit: handleSubmit,
  };
};
