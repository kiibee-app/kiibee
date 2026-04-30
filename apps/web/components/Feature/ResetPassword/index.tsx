"use client";

import { FormEvent, useCallback, useState } from "react";
import Image from "@/components/UI/SafeImage";
import { useTranslation } from "react-i18next";
import logo from "@/assets/icons/Kiibee_logo_mark_black.svg";
import GenericButton from "@/components/UI/GenericButton";
import InputField from "@/components/UI/InputFields";
import { MonoText } from "@/components/UI/Monotext";
import { Card, Description, Form, Title, Wrapper } from "./styles";
import { INPUT_TYPE } from "@/utils/ui";
import { EyeClosedIcon, EyeOpenIcon } from "@/assets/icons";
import { INPUT_VARIANTS } from "@/utils/Constants";

type PasswordState = {
  newPassword: string;
  repeatPassword: string;
};

type VisibilityState = {
  newPassword: boolean;
  repeatPassword: boolean;
};

export default function ResetPasswordForm() {
  const { t } = useTranslation();

  const [passwords, setPasswords] = useState<PasswordState>({
    newPassword: "",
    repeatPassword: "",
  });

  const [visibility, setVisibility] = useState<VisibilityState>({
    newPassword: false,
    repeatPassword: false,
  });

  const handleChange = useCallback(
    (field: keyof PasswordState, value: string | string[]) => {
      setPasswords((prev) => ({
        ...prev,
        [field]: String(value),
      }));
    },
    [],
  );

  const toggleVisibility = useCallback((field: keyof VisibilityState) => {
    setVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!passwords.newPassword || !passwords.repeatPassword) return;
    if (passwords.newPassword !== passwords.repeatPassword) return;
  };

  return (
    <Wrapper>
      <Card>
        <Image src={logo} alt="Kiibee Logo" width={42} height={42} priority />

        <Title>Create a new password</Title>

        <Description>
          <MonoText $use="Body_Regular">
            Enter your new password below to complete the reset process.
          </MonoText>
        </Description>

        <Form onSubmit={handleSubmit}>
          <InputField
            type={
              visibility.newPassword ? INPUT_TYPE.TEXT : INPUT_TYPE.PASSWORD
            }
            label="New password"
            placeholder="New password"
            value={passwords.newPassword}
            onChange={(val) => handleChange("newPassword", val as string)}
            icon={visibility.newPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
            onIconClick={() => toggleVisibility("newPassword")}
            variant={INPUT_VARIANTS.PRIMARY_GRAY}
          />

          <InputField
            type={
              visibility.repeatPassword ? INPUT_TYPE.TEXT : INPUT_TYPE.PASSWORD
            }
            label="Repeat new password"
            placeholder="Repeat new password"
            value={passwords.repeatPassword}
            onChange={(val) => handleChange("repeatPassword", val as string)}
            icon={
              visibility.repeatPassword ? <EyeOpenIcon /> : <EyeClosedIcon />
            }
            onIconClick={() => toggleVisibility("repeatPassword")}
            variant={INPUT_VARIANTS.PRIMARY_GRAY}
          />

          <GenericButton type="submit">
            {t("resetPassword.submit", "Reset")}
          </GenericButton>
        </Form>
      </Card>
    </Wrapper>
  );
}
