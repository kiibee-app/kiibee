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
import { SuccessArcIcon } from "@/assets/icons";
import { GenericModal } from "@/components/UI/Modals";

export default function ExportContent() {
  const { t } = useTranslation();

  const [exportType, setExportType] = useState<string>("users-email-signups");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleRequest = () => {
    setShowSuccessModal(true);
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
        <TextBlock>
          <MonoText $use="Body_SemiBold">
            {t(SETTINGS.export.typeLabel)}
          </MonoText>
          <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY}>
            {t(SETTINGS.export.typeDescription)}
          </MonoText>
        </TextBlock>
        <FieldBox>
          <DropdownField
            options={EXPORT_TYPE_OPTIONS(t)}
            value={exportType}
            onChange={(v) => setExportType(v)}
          />
        </FieldBox>
        <TextBlock>
          <MonoText $use="Body_SemiBold">
            {t(SETTINGS.export.dateLabel)}
          </MonoText>
          <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY}>
            {t(SETTINGS.export.dateDescription)}
          </MonoText>
        </TextBlock>
        <FieldBox>
          <DateRangeField
            start={startDate}
            end={endDate}
            onChangeStart={setStartDate}
            onChangeEnd={setEndDate}
          />
        </FieldBox>
      </Section>
      <GenericModal
        visible={showSuccessModal}
        icon={
          <SuccessArcIcon
            width={40}
            height={40}
            color={COLORS.primary.GREEN_200}
          />
        }
        iconMargin="0 auto 8px"
        title={t(SETTINGS.export.modalTitle)}
        message={t(SETTINGS.export.modalMessage)}
        confirmLabel={t("contents.createCollectionSuccessModal.done")}
        onClose={() => setShowSuccessModal(false)}
        onConfirm={() => setShowSuccessModal(false)}
        width="480px"
        padding="40px 30px"
        showCloseButton={false}
      />
    </Card>
  );
}
