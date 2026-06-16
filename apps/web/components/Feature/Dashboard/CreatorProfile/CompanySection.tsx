"use client";

import React from "react";
import InputField from "@/components/UI/InputFields";
import { Card, Fields } from "./styles";
import { CompanyKeys } from "@/utils/creatorProfile";
import { INPUT_VARIANTS } from "@/utils/Constants";
import { getCompanyFields } from "@/utils/creatorProfilefields";
import {
  CREATOR_PROFILE_DIGITS_ONLY_SET,
  NUMERIC_INPUT_MODE,
} from "@/utils/numericFields";

type CompanyProps = {
  form: Record<string, string>;
  onChange: (key: CompanyKeys) => (value: string | string[]) => void;
  t: (key: string) => string;
  fieldErrors?: Partial<Record<string, string>>;
};

export default function CompanySection({
  form,
  onChange,
  t,
  fieldErrors,
}: CompanyProps) {
  const fields = getCompanyFields(t);

  return (
    <Card>
      <Fields>
        {fields.map((field, index) => (
          <InputField
            key={field.key}
            label={field.label}
            placeholder={field.placeholder}
            value={form[field.key]}
            onChange={onChange(field.key)}
            inputMode={
              CREATOR_PROFILE_DIGITS_ONLY_SET.has(field.key)
                ? NUMERIC_INPUT_MODE
                : undefined
            }
            labelFontStyle="Body_Regular"
            variant={INPUT_VARIANTS.PRIMARY_GRAY}
            labelMarginTop={index !== 0 ? "16px" : undefined}
            hasError={!!fieldErrors?.[field.key]}
            errorMessage={fieldErrors?.[field.key]}
          />
        ))}
      </Fields>
    </Card>
  );
}
