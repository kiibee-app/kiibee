"use client";

import { FormEvent, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Image from "@/components/UI/SafeImage";
import AuthBackButton from "@/components/Feature/Auth/AuthBackButton";
import GenericButton from "@/components/UI/GenericButton";
import InputField from "@/components/UI/InputFields";
import { EyeClosedIcon, EyeOpenIcon } from "@/assets/icons";
import logo from "@/assets/icons/Kiibee_logo_mark_black.svg";
import {
  DEFAULT_SUBSCRIPTION_PLAN,
  subscriptionPlans,
} from "@/utils/subscriptionPlans";
import { INPUT_TYPE } from "@/utils/ui";
import SortDropdown from "@/components/UI/SortDropdown";
import {
  BackRow,
  Content,
  FieldGrid,
  Form,
  PlanSelectRow,
  SubscriptionPageInner,
  SubscriptionShell,
  TwoColumnRow,
} from "./styles";

type PasswordVisibility = {
  password: boolean;
  repeatPassword: boolean;
};

export default function SubscriptionSection() {
  const { t } = useTranslation();
  const [selectedPlan, setSelectedPlan] = useState(DEFAULT_SUBSCRIPTION_PLAN);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [passwordVisibility, setPasswordVisibility] =
    useState<PasswordVisibility>({
      password: false,
      repeatPassword: false,
    });

  const planOptions = useMemo(
    () =>
      subscriptionPlans.map((plan) => ({
        value: plan.id,
        label: t(plan.labelKey),
        description: t(plan.priceKey),
      })),
    [t],
  );

  const isSubmitEnabled =
    email.trim().length > 0 &&
    password.trim().length > 0 &&
    repeatPassword.trim().length > 0 &&
    password === repeatPassword;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <SubscriptionShell>
      <SubscriptionPageInner>
        <BackRow>
          <AuthBackButton href="/auth/signup-viewer" />
        </BackRow>

        <Content>
          <Image
            src={logo}
            alt={t("subscriptionPage.logoAlt")}
            width={42}
            height={42}
            priority
          />

          <Form onSubmit={handleSubmit}>
            <PlanSelectRow>
              <SortDropdown
                options={planOptions}
                value={selectedPlan}
                onChange={setSelectedPlan}
                hideSelectedOption={false}
                renderSelectedLabel={(_, option) =>
                  option ? `${option.label} (${option.description})` : ""
                }
                renderOptionLabel={(option) => (
                  <span>
                    {option.label} ({option.description})
                  </span>
                )}
                width="100%"
                maxWidth="312px"
                variant="success"
              />
            </PlanSelectRow>

            <FieldGrid>
              <InputField
                label={t("subscriptionPage.fields.confirmEmail")}
                labelFontStyle="Body_Regular"
                labelMarginTop="0"
                type={INPUT_TYPE.EMAIL}
                placeholder={t("subscriptionPage.fields.confirmEmail")}
                value={email}
                onChange={(value) => setEmail(String(value))}
              />

              <TwoColumnRow>
                <InputField
                  label={t("subscriptionPage.fields.password")}
                  labelFontStyle="Body_Regular"
                  labelMarginTop="0"
                  type={
                    passwordVisibility.password
                      ? INPUT_TYPE.TEXT
                      : INPUT_TYPE.PASSWORD
                  }
                  placeholder={t("subscriptionPage.fields.password")}
                  value={password}
                  onChange={(value) => setPassword(String(value))}
                  icon={
                    passwordVisibility.password ? (
                      <EyeOpenIcon />
                    ) : (
                      <EyeClosedIcon />
                    )
                  }
                  onIconClick={() =>
                    setPasswordVisibility((prev) => ({
                      ...prev,
                      password: !prev.password,
                    }))
                  }
                />

                <InputField
                  label={t("subscriptionPage.fields.repeatPassword")}
                  labelFontStyle="Body_Regular"
                  labelMarginTop="0"
                  type={
                    passwordVisibility.repeatPassword
                      ? INPUT_TYPE.TEXT
                      : INPUT_TYPE.PASSWORD
                  }
                  placeholder={t("subscriptionPage.fields.repeatPassword")}
                  value={repeatPassword}
                  onChange={(value) => setRepeatPassword(String(value))}
                  icon={
                    passwordVisibility.repeatPassword ? (
                      <EyeOpenIcon />
                    ) : (
                      <EyeClosedIcon />
                    )
                  }
                  onIconClick={() =>
                    setPasswordVisibility((prev) => ({
                      ...prev,
                      repeatPassword: !prev.repeatPassword,
                    }))
                  }
                />
              </TwoColumnRow>
            </FieldGrid>

            <GenericButton
              type="submit"
              disabled={!isSubmitEnabled}
              variant="primary"
              size="md"
              style={{ alignSelf: "center", width: "312px", marginTop: "20px" }}
            >
              {t("subscriptionPage.continue")}
            </GenericButton>
          </Form>
        </Content>
      </SubscriptionPageInner>
    </SubscriptionShell>
  );
}
