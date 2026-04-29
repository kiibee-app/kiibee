"use client";

import React, { useCallback, useState } from "react";
import InputField from "@/components/UI/InputFields";
import { PasswordFields } from "./styles";
import { useTranslation } from "react-i18next";
import { INPUT_VARIANTS } from "@/utils/Constants";
import { Passwords } from "@/utils/creatorProfile";
import { getPasswordFields } from "@/utils/creatorProfilefields";
import { INPUT_TYPE } from "@/utils/ui";
import { EyeClosedIcon, EyeOpenIcon } from "@/assets/icons";

type Props = {
  passwords: Passwords;
  onPasswordChange: (field: keyof Passwords, val?: string) => void;
};

type PasswordVisibility = {
  currentPassword: boolean;
  newPassword: boolean;
  repeatPassword: boolean;
};

export default function PasswordSection({
  passwords,
  onPasswordChange,
}: Props) {
  const { t } = useTranslation();
  const fields = getPasswordFields(t);
  const [passwordVisibility, setPasswordVisibility] =
    useState<PasswordVisibility>({
      currentPassword: false,
      newPassword: false,
      repeatPassword: false,
    });

  const handlePasswordInputChange = useCallback(
    (field: keyof Passwords, value: string | string[]) => {
      onPasswordChange(field, String(value));
    },
    [onPasswordChange],
  );

  const togglePasswordVisibility = useCallback(
    (field: keyof PasswordVisibility) => {
      setPasswordVisibility((prev) => ({
        ...prev,
        [field]: !prev[field],
      }));
    },
    [],
  );

  return (
    <PasswordFields>
      {fields.map((field, index) => {
        const key = field.key as keyof PasswordVisibility;
        const isVisible = passwordVisibility[key];

        return (
          <InputField
            key={field.key}
            label={field.label}
            type={isVisible ? INPUT_TYPE.TEXT : INPUT_TYPE.PASSWORD}
            value={passwords[field.key as keyof Passwords]}
            onChange={handlePasswordInputChange.bind(
              null,
              field.key as keyof Passwords,
            )}
            labelMarginTop={index !== 0 ? "12px" : undefined}
            variant={INPUT_VARIANTS.PRIMARY_GRAY}
            icon={isVisible ? <EyeOpenIcon /> : <EyeClosedIcon />}
            onIconClick={togglePasswordVisibility.bind(null, key)}
          />
        );
      })}
    </PasswordFields>
  );
}
