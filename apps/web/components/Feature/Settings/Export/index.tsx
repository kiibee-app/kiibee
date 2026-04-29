"use client";

import React, { useState } from "react";
import { MonoText } from "@/components/UI/Monotext";
import { useTranslation } from "react-i18next";
import { Card, CardTop, TextBlock, Section, FieldBox } from "./styles";
import { SETTINGS } from "@/utils/translationKeys";
import DropdownField from "@/components/UI/InputFields/DropdownField";
import DateRangeField from "@/components/UI/InputFields/DateRangeField";
import GenericButton from "@/components/UI/GenericButton";
import { VARIANT } from "@/utils/Constants";
import COLORS from "@repo/ui/colors";
import { EXPORT_TYPE_OPTIONS } from "@/utils/exportOptions";

export default function ExportContent() {
  const { t } = useTranslation();

  const [exportType, setExportType] = useState<string>("users-email-signups");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const handleRequest = () => {
    console.log("request export", {
      exportType,
      startDate,
      endDate,
    });
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
            options={EXPORT_TYPE_OPTIONS(t)}
            value={exportType}
            onChange={(v) => setExportType(v)}
          />
        </FieldBox>

        <FieldBox>
          <DateRangeField
            label={t(SETTINGS.export.dateLabel)}
            start={startDate}
            end={endDate}
            onChangeStart={setStartDate}
            onChangeEnd={setEndDate}
          />
        </FieldBox>
      </Section>
    </Card>
  );
}
