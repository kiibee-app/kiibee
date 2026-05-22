"use client";

import React from "react";
import InputField from "@/components/UI/InputFields";
import { Card, Fields } from "./styles";
import { CompanyKeys } from "@/utils/creatorProfile";
import { INPUT_VARIANTS } from "@/utils/Constants";
import { getCompanyFields } from "@/utils/creatorProfilefields";

const NUMERIC_COMPANY_KEYS = new Set(["phone", "cvr", "postal"]);

type CompanyProps = {
  form: Record<string, string>;
  onChange: (key: CompanyKeys) => (value: string | string[]) => void;
  t: (key: string) => string;
};

export default function CompanySection({ form, onChange, t }: CompanyProps) {
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
              NUMERIC_COMPANY_KEYS.has(field.key) ? "numeric" : undefined
            }
            labelFontStyle="Body_Regular"
            variant={INPUT_VARIANTS.PRIMARY_GRAY}
            labelMarginTop={index !== 0 ? "16px" : undefined}
          />
        ))}
      </Fields>
    </Card>
  );
}
