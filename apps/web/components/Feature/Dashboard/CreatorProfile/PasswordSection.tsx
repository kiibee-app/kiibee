"use client";

import React, { useCallback, useState } from "react";
import FormField from "@/components/UI/FormField";
import { PasswordFields } from "./styles";
import { useTranslation } from "react-i18next";
import { INPUT_VARIANTS } from "@/utils/Constants";
import { Passwords } from "@/utils/creatorProfile";
import { getPasswordFields } from "@/utils/creatorProfilefields";
import { INPUT_TYPE } from "@/utils/ui";
import { EyeClosedIcon, EyeOpenIcon } from "@/assets/icons";
import { useFormContext } from "react-hook-form";

type Props = {
  onFieldChange?: () => void;
};

type PasswordVisibility = {
  currentPassword: boolean;
  newPassword: boolean;
  repeatPassword: boolean;
};

export default function PasswordSection({ onFieldChange }: Props) {
  const { t } = useTranslation();
  const fields = getPasswordFields(t);
  const { setValue } = useFormContext<Passwords>();
  const [passwordVisibility, setPasswordVisibility] =
    useState<PasswordVisibility>({
      currentPassword: false,
      newPassword: false,
      repeatPassword: false,
    });

  const handlePasswordInputChange = useCallback(
    (field: keyof Passwords, value: string | string[]) => {
      setValue(field, String(value), {
        shouldDirty: true,
        shouldValidate: true,
      });
      onFieldChange?.();
    },
    [onFieldChange, setValue],
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
          <FormField<Passwords>
            key={field.key}
            name={field.key as keyof Passwords}
            label={field.label}
            type={isVisible ? INPUT_TYPE.TEXT : INPUT_TYPE.PASSWORD}
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
