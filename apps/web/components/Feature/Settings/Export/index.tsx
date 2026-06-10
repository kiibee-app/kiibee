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
import { GenericModal } from "@/components/UI/Modals";
import SuccessModalIcon from "@/components/UI/Modals/SuccessModalIcon";
import { useExportRequest } from "@/hooks/useExport";
import { useExportDateRange } from "@/hooks/useExportDateRange";

export default function ExportContent() {
  const { t } = useTranslation();
  const { requestExport, isPending } = useExportRequest();
  const { startDate, endDate, setDateRange } = useExportDateRange();

  const [exportType, setExportType] = useState<string>("users-email-signups");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleRequest = async () => {
    try {
      await requestExport({
        type: exportType,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });
      setShowSuccessModal(true);
    } catch {}
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

        <GenericButton
          variant={VARIANT.PRIMARY}
          onClick={handleRequest}
          isLoading={isPending}
        >
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
            onChangeRange={setDateRange}
          />
        </FieldBox>
      </Section>
      <GenericModal
        visible={showSuccessModal}
        icon={<SuccessModalIcon />}
        iconMargin="0 auto 8px"
        title={t(SETTINGS.export.modalTitle)}
        message={t(SETTINGS.export.modalMessage)}
        confirmLabel={t("contents.createCollectionSuccessModal.done")}
        onClose={() => setShowSuccessModal(false)}
        onConfirm={() => setShowSuccessModal(false)}
        size="sm"
        spacing="xs"
        showCloseButton={false}
      />
    </Card>
  );
}
