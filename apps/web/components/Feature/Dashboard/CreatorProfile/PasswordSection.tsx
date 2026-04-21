"use client";

import React from "react";
import InputField from "@/components/UI/InputFields";
import { PasswordFields } from "./styles";
import { CREATOR_PROFILE } from "@/utils/translationKeys";
import { useTranslation } from "react-i18next";

type Passwords = {
  current: string;
  next: string;
  confirm: string;
};

type Props = {
  passwords: Passwords;
  onPasswordChange: (field: keyof Passwords, val?: string) => void;
};

export default function PasswordSection({
  passwords,
  onPasswordChange,
}: Props) {
  const { t } = useTranslation();
  const handleChange = (field: keyof Passwords) => (val: string) =>
    onPasswordChange(field, val);

  return (
    <PasswordFields>
      <InputField
        label={t(CREATOR_PROFILE.currentPassword)}
        type="password"
        value={passwords.current}
        onChange={(v) => handleChange("current")(String(v))}
      />
      <InputField
        label={t(CREATOR_PROFILE.newPassword)}
        type="password"
        value={passwords.next}
        onChange={(v) => handleChange("next")(String(v))}
        labelMarginTop="12px"
      />
      <InputField
        label={t(CREATOR_PROFILE.confirmPassword)}
        type="password"
        value={passwords.confirm}
        onChange={(v) => handleChange("confirm")(String(v))}
        labelMarginTop="12px"
      />
    </PasswordFields>
  );
}
