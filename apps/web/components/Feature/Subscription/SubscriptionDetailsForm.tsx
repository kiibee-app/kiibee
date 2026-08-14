"use client";

import type React from "react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { EyeClosedIcon, EyeOpenIcon } from "@/assets/icons";
import { MonoText } from "@/components/UI/Monotext";
import { PASSWORD_VISIBILITY_KEY } from "@/utils/Constants";
import { subscriptionPlans } from "@/utils/subscriptionPlans";
import { SUBSCRIPTION } from "@/utils/translationKeys";
import { INPUT_TYPE } from "@/utils/ui";
import { useSubscriptionContext } from "@/providers/subscriptionProvider";
import {
  ContinueButton,
  FieldGrid,
  Form,
  PlanSelectRow,
  SelectedPlanBadge,
  StyledInputField,
  TwoColumnRow,
  ValidationErrorContainer,
  ValidationErrorMsg,
} from "./styles";

export default function SubscriptionDetailsForm() {
  const { t } = useTranslation();
  const {
    selectedPlan,
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
    isInviteSubmitting,
    isEmailValid,
    isPasswordValid,
    passwordsMatch,
    validationError,
  } = useSubscriptionContext();

  const currentPlan = useMemo(
    () => subscriptionPlans.find((plan) => plan.id === selectedPlan),
    [selectedPlan],
  );

  const selectedPlanLabel = currentPlan
    ? `${t(currentPlan.nameKey)} (${getPlanPriceLabel(currentPlan.id)})`
    : "";

  return (
    <Form onSubmit={onSubmit}>
      <PlanSelectRow>
        <SelectedPlanBadge>
          <MonoText $use="Body_Regular">{selectedPlanLabel}</MonoText>
        </SelectedPlanBadge>
      </PlanSelectRow>

      <FieldGrid>
        <StyledInputField
          label={t(SUBSCRIPTION.creatorDetails.email)}
          labelFontStyle="Body_Regular"
          labelMarginTop="0"
          type={INPUT_TYPE.EMAIL}
          placeholder={t(SUBSCRIPTION.creatorDetails.email)}
          value={email}
          onChange={(value) => onEmailChange(String(value))}
          errorMessage={
            email && !isEmailValid
              ? t("subscriptionPage.invite.emailInvalid")
              : undefined
          }
          hasError={email ? !isEmailValid : false}
        />

        <TwoColumnRow>
          <StyledInputField
            label={t(SUBSCRIPTION.creatorDetails.password)}
            labelFontStyle="Body_Regular"
            labelMarginTop="0"
            type={
              passwordVisibility.password
                ? INPUT_TYPE.TEXT
                : INPUT_TYPE.PASSWORD
            }
            placeholder={t(SUBSCRIPTION.creatorDetails.password)}
            value={password}
            onChange={(value) => onPasswordChange(String(value))}
            icon={
              passwordVisibility.password ? <EyeOpenIcon /> : <EyeClosedIcon />
            }
            onIconClick={() =>
              onTogglePasswordVisibility(PASSWORD_VISIBILITY_KEY.PASSWORD)
            }
            errorMessage={
              password && !isPasswordValid
                ? t("subscriptionPage.invite.passwordMinLength")
                : undefined
            }
            hasError={password ? !isPasswordValid : false}
          />

          <StyledInputField
            label={t(SUBSCRIPTION.creatorDetails.repeatPassword)}
            labelFontStyle="Body_Regular"
            labelMarginTop="0"
            type={
              passwordVisibility.repeatPassword
                ? INPUT_TYPE.TEXT
                : INPUT_TYPE.PASSWORD
            }
            placeholder={t(SUBSCRIPTION.creatorDetails.repeatPassword)}
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
            errorMessage={
              password && repeatPassword && !passwordsMatch
                ? t("subscriptionPage.invite.passwordMismatch")
                : undefined
            }
            hasError={password && repeatPassword ? !passwordsMatch : false}
          />
        </TwoColumnRow>
      </FieldGrid>

      {validationError && (
        <ValidationErrorContainer>
          <ValidationErrorMsg>{validationError}</ValidationErrorMsg>
        </ValidationErrorContainer>
      )}

      <ContinueButton
        type="submit"
        disabled={!isSubmitEnabled || isInviteSubmitting}
        isLoading={isInviteSubmitting}
      >
        {t(SUBSCRIPTION.continue)}
      </ContinueButton>
    </Form>
  );
}
