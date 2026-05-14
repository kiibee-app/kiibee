"use client";

import React, { useCallback, useState } from "react";
import FormField from "@/components/UI/FormField";
import InputField from "@/components/UI/InputFields";
import { PasswordFields } from "./styles";
import { useTranslation } from "react-i18next";
import { INPUT_VARIANTS } from "@/utils/Constants";
import { Passwords } from "@/utils/creatorProfile";
import { getPasswordFields } from "@/utils/creatorProfilefields";
import { INPUT_TYPE } from "@/utils/ui";
import { EyeClosedIcon, EyeOpenIcon } from "@/assets/icons";
import { useFormContext } from "react-hook-form";

type Props = {
  passwords?: Passwords;
  onPasswordChange?: (field: keyof Passwords, val?: string) => void;
  onFieldChange?: () => void;
};

type PasswordVisibility = {
  current: boolean;
  next: boolean;
  confirm: boolean;
};

export default function PasswordSection({
  passwords,
  onPasswordChange,
  onFieldChange,
}: Props) {
  const { t } = useTranslation();
  const fields = getPasswordFields(t);
  const formContext = useFormContext<Passwords>();
  const [passwordVisibility, setPasswordVisibility] =
    useState<PasswordVisibility>({
      current: false,
      next: false,
      confirm: false,
    });

  const handlePasswordInputChange = useCallback(
    (field: keyof Passwords, value: string | string[]) => {
      if (formContext) {
        formContext.setValue(field, String(value), {
          shouldDirty: true,
          shouldValidate: true,
        });
      } else {
        onPasswordChange?.(field, String(value));
      }
      onFieldChange?.();
    },
    [formContext, onFieldChange, onPasswordChange],
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

        return formContext ? (
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
        ) : (
          <InputField
            key={field.key}
            label={field.label}
            type={isVisible ? INPUT_TYPE.TEXT : INPUT_TYPE.PASSWORD}
            value={passwords?.[field.key as keyof Passwords] ?? ""}
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
