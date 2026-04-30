"use client";

import type React from "react";
import { useMemo } from "react";
import { EyeClosedIcon, EyeOpenIcon } from "@/assets/icons";
import SortDropdown from "@/components/UI/SortDropdown";
import {
  PASSWORD_VISIBILITY_KEY,
  SORT_DROPDOWN_VARIANT,
  type PasswordVisibilityKey,
} from "@/utils/Constants";
import { subscriptionPlans } from "@/utils/subscriptionPlans";
import { INPUT_TYPE } from "@/utils/ui";
import {
  ContinueButton,
  FieldGrid,
  Form,
  PlanSelectRow,
  StyledInputField,
  TwoColumnRow,
} from "./styles";

type SubscriptionDetailsFormProps = {
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
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  t: (key: string) => string;
};

export default function SubscriptionDetailsForm({
  selectedPlan,
  onSelectPlan,
  email,
  password,
  repeatPassword,
  onEmailChange,
  onPasswordChange,
  onRepeatPasswordChange,
  passwordVisibility,
  onTogglePasswordVisibility,
  isSubmitEnabled,
  getPlanPriceLabel,
  onSubmit,
  t,
}: SubscriptionDetailsFormProps) {
  const planOptions = useMemo(
    () =>
      subscriptionPlans.map((plan) => ({
        value: plan.id,
        label: t(plan.nameKey),
      })),
    [t],
  );

  return (
    <Form onSubmit={onSubmit}>
      <PlanSelectRow>
        <SortDropdown
          options={planOptions}
          value={selectedPlan}
          onChange={onSelectPlan}
          renderSelectedLabel={(_, option) =>
            option ? `${option.label} (${getPlanPriceLabel(option.value)})` : ""
          }
          renderOptionLabel={(option) => (
            <span>
              {option.label} ({getPlanPriceLabel(option.value)})
            </span>
          )}
          width="100%"
          maxWidth="312px"
          variant={SORT_DROPDOWN_VARIANT.SUCCESS}
        />
      </PlanSelectRow>

      <FieldGrid>
        <StyledInputField
          label={t("subscriptionPage.creatorDetails.email")}
          labelFontStyle="Body_Regular"
          labelMarginTop="0"
          type={INPUT_TYPE.EMAIL}
          placeholder={t("subscriptionPage.creatorDetails.email")}
          value={email}
          onChange={(value) => onEmailChange(String(value))}
        />

        <TwoColumnRow>
          <StyledInputField
            label={t("subscriptionPage.creatorDetails.password")}
            labelFontStyle="Body_Regular"
            labelMarginTop="0"
            type={
              passwordVisibility.password
                ? INPUT_TYPE.TEXT
                : INPUT_TYPE.PASSWORD
            }
            placeholder={t("subscriptionPage.creatorDetails.password")}
            value={password}
            onChange={(value) => onPasswordChange(String(value))}
            icon={
              passwordVisibility.password ? <EyeOpenIcon /> : <EyeClosedIcon />
            }
            onIconClick={() =>
              onTogglePasswordVisibility(PASSWORD_VISIBILITY_KEY.PASSWORD)
            }
          />

          <StyledInputField
            label={t("subscriptionPage.creatorDetails.repeatPassword")}
            labelFontStyle="Body_Regular"
            labelMarginTop="0"
            type={
              passwordVisibility.repeatPassword
                ? INPUT_TYPE.TEXT
                : INPUT_TYPE.PASSWORD
            }
            placeholder={t("subscriptionPage.creatorDetails.repeatPassword")}
            value={repeatPassword}
            onChange={(value) => onRepeatPasswordChange(String(value))}
            icon={
              passwordVisibility.repeatPassword ? (
                <EyeOpenIcon />
              ) : (
                <EyeClosedIcon />
              )
            }
            onIconClick={() =>
              onTogglePasswordVisibility(
                PASSWORD_VISIBILITY_KEY.REPEAT_PASSWORD,
              )
            }
          />
        </TwoColumnRow>
      </FieldGrid>

      <ContinueButton type="submit" disabled={!isSubmitEnabled}>
        {t("subscriptionPage.continue")}
      </ContinueButton>
    </Form>
  );
}
