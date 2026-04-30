"use client";

import { FormEvent, useCallback, useMemo, useState } from "react";
import Image from "@/components/UI/SafeImage";
import { useTranslation } from "react-i18next";
import logo from "@/assets/icons/Kiibee_logo_mark_black.svg";
import GenericButton from "@/components/UI/GenericButton";
import InputField from "@/components/UI/InputFields";
import { Card, Description, Form, Title, Wrapper } from "./styles";
import { INPUT_TYPE } from "@/utils/ui";
import { EyeClosedIcon, EyeOpenIcon } from "@/assets/icons";
import ResetPasswordSuccess from "./ResetPasswordSuccess";
import { INPUT_VARIANTS } from "@/utils/Constants";
import {
  getResetPasswordFields,
  INITIAL_PASSWORDS,
  INITIAL_VISIBILITY,
  PasswordState,
  VisibilityState,
} from "@/utils/resetPassword";

export default function ResetPasswordForm() {
  const { t } = useTranslation();
  const [isSuccess, setIsSuccess] = useState(false);
  const [passwords, setPasswords] = useState(INITIAL_PASSWORDS);
  const [visibility, setVisibility] = useState(INITIAL_VISIBILITY);

  const handleChange = useCallback(
    (field: keyof PasswordState, value: string) => {
      setPasswords((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const toggleVisibility = useCallback((field: keyof VisibilityState) => {
    setVisibility((prev) => ({ ...prev, [field]: !prev[field] }));
  }, []);

  const isValid = useMemo(() => {
    const { newPassword, repeatPassword } = passwords;
    return (
      newPassword.length > 0 &&
      repeatPassword.length > 0 &&
      newPassword === repeatPassword
    );
  }, [passwords]);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!isValid) return;
      setIsSuccess(true);
    },
    [isValid],
  );

  const fields = getResetPasswordFields();
  if (isSuccess) return <ResetPasswordSuccess />;

  return (
    <Wrapper>
      <Card>
        <Image src={logo} alt="Kiibee Logo" width={42} height={42} />
        <Title>{t("resetPassword.title")}</Title>
        <Description>{t("resetPassword.description")}</Description>

        <Form onSubmit={handleSubmit}>
          {fields.map(({ key, label, placeholder }) => {
            const isVisible = visibility[key];

            return (
              <InputField
                key={key}
                type={isVisible ? INPUT_TYPE.TEXT : INPUT_TYPE.PASSWORD}
                label={t(label)}
                placeholder={t(placeholder)}
                value={passwords[key]}
                onChange={(val) => handleChange(key, String(val))}
                icon={isVisible ? <EyeOpenIcon /> : <EyeClosedIcon />}
                onIconClick={() => toggleVisibility(key)}
                variant={INPUT_VARIANTS.PRIMARY_GRAY}
              />
            );
          })}

          <GenericButton type="submit" disabled={!isValid}>
            {t("resetPassword.submit")}
          </GenericButton>
        </Form>
      </Card>
    </Wrapper>
  );
}
