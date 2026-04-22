"use client";

import React from "react";
import InputField from "@/components/UI/InputFields";
import { PasswordFields } from "./styles";
import { useTranslation } from "react-i18next";
import { INPUT_VARIANTS } from "@/utils/Constants";
import { Passwords } from "@/utils/creatorProfile";
import { getPasswordFields } from "@/utils/creatorProfilefields";
import { INPUT_TYPE } from "@/utils/ui";

type Props = {
  passwords: Passwords;
  onPasswordChange: (field: keyof Passwords, val?: string) => void;
};

export default function PasswordSection({
  passwords,
  onPasswordChange,
}: Props) {
  const { t } = useTranslation();

  const fields = getPasswordFields(t);

  return (
    <PasswordFields>
      {fields.map((field, index) => (
        <InputField
          key={field.key}
          label={field.label}
          type={INPUT_TYPE.PASSWORD}
          value={passwords[field.key as keyof Passwords]}
          onChange={(val) =>
            onPasswordChange(field.key as keyof Passwords, String(val))
          }
          labelMarginTop={index !== 0 ? "12px" : undefined}
          variant={INPUT_VARIANTS.PRIMARY_GRAY}
        />
      ))}
    </PasswordFields>
  );
}
