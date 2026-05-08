"use client";

import type React from "react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { EyeClosedIcon, EyeOpenIcon } from "@/assets/icons";
import SortDropdown from "@/components/UI/SortDropdown";
import {
  PASSWORD_VISIBILITY_KEY,
  SORT_DROPDOWN_VARIANT,
} from "@/utils/Constants";
import { subscriptionPlans } from "@/utils/subscriptionPlans";
import { SUBSCRIPTION } from "@/utils/translationKeys";
import { INPUT_TYPE } from "@/utils/ui";
import { useSubscriptionContext } from "@/providers/subscription-provider";
import {
  ContinueButton,
  FieldGrid,
  Form,
  PlanSelectRow,
  StyledInputField,
  TwoColumnRow,
} from "./styles";

export default function SubscriptionDetailsForm() {
  const { t } = useTranslation();
  const {
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
  } = useSubscriptionContext();

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
          label={t(SUBSCRIPTION.creatorDetails.email)}
          labelFontStyle="Body_Regular"
          labelMarginTop="0"
          type={INPUT_TYPE.EMAIL}
          placeholder={t(SUBSCRIPTION.creatorDetails.email)}
          value={email}
          onChange={(value) => onEmailChange(String(value))}
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
          />
        </TwoColumnRow>
      </FieldGrid>

      <ContinueButton type="submit" disabled={!isSubmitEnabled}>
        {t(SUBSCRIPTION.continue)}
      </ContinueButton>
    </Form>
  );
}
