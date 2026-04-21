"use client";

import React from "react";
import InputField from "@/components/UI/InputFields";
import { CREATOR_PROFILE } from "@/utils/translationKeys";
import { Card, Fields, SectionTitle, Optional, OptionalSmall } from "./styles";
import { CompanyKeys } from "@/utils/creatorProfile";

type CompanyProps = {
  form: {
    company: string;
    phone: string;
    cvr: string;
    address: string;
    city: string;
    postal: string;
  };
  onChange: (key: CompanyKeys) => (value: string | string[]) => void;
  t: (key: string) => string;
};

export default function CompanySection({ form, onChange, t }: CompanyProps) {
  return (
    <Card>
      <SectionTitle>
        {t(CREATOR_PROFILE.companyName)}
        <Optional>({t("common.optional")})</Optional>
      </SectionTitle>

      <Fields>
        <InputField
          label={t(CREATOR_PROFILE.companyName)}
          placeholder={t(CREATOR_PROFILE.companyPlaceholder)}
          value={form.company}
          onChange={onChange("company")}
          labelFontStyle="Body_Regular"
        />

        <InputField
          label={t(CREATOR_PROFILE.phone)}
          value={form.phone}
          onChange={onChange("phone")}
          labelMarginTop="16px"
          labelFontStyle="Body_Regular"
        />

        <InputField
          label={
            <>
              {t(CREATOR_PROFILE.cvr)}
              <OptionalSmall> ({t("common.optional")})</OptionalSmall>
            </>
          }
          placeholder={t(CREATOR_PROFILE.cvrPlaceholder)}
          value={form.cvr}
          onChange={onChange("cvr")}
          labelMarginTop="16px"
          labelFontStyle="Body_Regular"
        />

        <InputField
          label={t(CREATOR_PROFILE.address)}
          value={form.address}
          onChange={onChange("address")}
          labelMarginTop="16px"
          labelFontStyle="Body_Regular"
        />

        <div style={{ marginTop: 12 }}>
          <InputField
            label={t(CREATOR_PROFILE.city)}
            value={form.city}
            onChange={onChange("city")}
            labelFontStyle="Body_Regular"
          />
          <InputField
            label={t(CREATOR_PROFILE.postal)}
            value={form.postal}
            onChange={onChange("postal")}
            labelFontStyle="Body_Regular"
          />
        </div>
      </Fields>
    </Card>
  );
}
