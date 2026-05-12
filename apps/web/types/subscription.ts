import type React from "react";
import type {
  PasswordVisibilityKey,
  SUBSCRIPTION_STEP,
} from "@/utils/Constants";

export type SubscriptionStep =
  (typeof SUBSCRIPTION_STEP)[keyof typeof SUBSCRIPTION_STEP];

export type SubscriptionDetailsFormProps = {
  selectedPlan: string;
  onSelectPlan: (planId: string) => void;
  email: string;
  password: string;
  repeatPassword: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onRepeatPasswordChange: (value: string) => void;
  passwordVisibility: {
    password: boolean;
    repeatPassword: boolean;
  };
  onTogglePasswordVisibility: (key: PasswordVisibilityKey) => void;
  isSubmitEnabled: boolean;
  getPlanPriceLabel: (planId: string) => string;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
  t: (key: string) => string;
};

export interface SubscriptionContextValue {
  selectedPlan: string;
  currentStep: SubscriptionStep;
  passwordVisibility: {
    [key: string]: boolean;
  };
  email: string;
  password: string;
  repeatPassword: string;
  isSubmitEnabled: boolean;
  setSelectedPlan: (planId: string) => void;
  setCurrentStep: (step: SubscriptionStep) => void;
  handleContinue: () => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  handleTogglePasswordVisibility: (key: PasswordVisibilityKey) => void;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  setRepeatPassword: (value: string) => void;
  getPlanPriceLabel: (planId: string) => string;
  onSelectPlan: (planId: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onRepeatPasswordChange: (value: string) => void;
  onTogglePasswordVisibility: (key: PasswordVisibilityKey) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
  /** Creator invite: run after card step (or call from details for free plan). */
  completeCreatorInviteSignup: () => Promise<void>;
  /** Creator invite payment step: return to password/details and clear errors. */
  backFromPaymentStep: () => void;
  isCreatorInviteFlow: boolean;
  isValidatingInviteToken: boolean;
  isInviteSubmitting: boolean;
  inviteTokenError: string | null;
  inviteSubmitError: string | null;
}
