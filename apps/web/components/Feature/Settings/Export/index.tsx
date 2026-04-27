"use client";

import React, { useState } from "react";
import { MonoText } from "@/components/UI/Monotext";
import { useTranslation } from "react-i18next";
import { Card, CardTop, TextBlock, Section, FieldBox, Row } from "./styles";
import { SETTINGS } from "@/utils/translationKeys";
import DropdownField from "@/components/UI/InputFields/DropdownField";
import DateRangeField from "@/components/UI/InputFields/DateRangeField";
import GenericButton from "@/components/UI/GenericButton";
import { VARIANT } from "@/utils/Constants";
import COLORS from "@repo/ui/colors";

export default function ExportContent() {
  const { t } = useTranslation();
  const [includeMedia, setIncludeMedia] = useState(true);
  const [exportType, setExportType] = useState<string>("users-email-signups");

  const handleRequest = () => {
    console.log("request export", { includeMedia });
  };

  return (
    <Card>
      <CardTop>
        <TextBlock>
          <MonoText $use="Body_SemiBold">{t(SETTINGS.export.title)}</MonoText>

          <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY}>
            {t(SETTINGS.export.description)}
          </MonoText>
        </TextBlock>

        <GenericButton variant={VARIANT.PRIMARY} onClick={handleRequest}>
          {t(SETTINGS.export.buildCsv)}
        </GenericButton>
      </CardTop>

      <Section>
        <FieldBox>
          <DropdownField
            label={t(SETTINGS.export.typeLabel)}
            options={[
              {
                value: "users-email-signups",
                label: t(SETTINGS.export.exportTypeUsersEmailSignups),
              },
              { value: "sales", label: t(SETTINGS.export.exportTypeSales) },
              { value: "views", label: t(SETTINGS.export.exportTypeViews) },
            ]}
            value={exportType}
            onChange={(v) => setExportType(v)}
          />
        </FieldBox>

        <FieldBox>
          <DateRangeField
            label={t(SETTINGS.export.dateLabel)}
            start={""}
            end={""}
            onChangeStart={() => {}}
            onChangeEnd={() => {}}
          />
        </FieldBox>
      </Section>
    </Card>
  );
}
