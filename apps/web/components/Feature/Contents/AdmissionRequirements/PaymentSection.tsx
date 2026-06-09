"use client";

import React from "react";
import InputField from "@/components/UI/InputFields";
import SortDropdown, { DropdownOption } from "@/components/UI/SortDropdown";
import { MonoText } from "@/components/UI/Monotext";
import { INPUT_VARIANTS, SORT_DROPDOWN_VARIANT } from "@/utils/Constants";
import { AccessDurationValue } from "@/utils/common";
import { PAYMENTS_FORM_FIELDS, toText } from "@/utils/paymentRequirements";
import {
  Block,
  ControlWrap,
  DropdownWrap,
  FeeNote,
  SectionText,
  SectionTitle,
} from "../Payment/styles";

interface SettingsPaymentSectionProps {
  t: (key: string) => string;
  formState: {
    rentalAmount: string;
    purchaseAmount: string;
    maxAccessLimit: string;
    showRentalSection: boolean;
    showPurchaseSection: boolean;
  };
  updateField: (key: string, value: string) => void;
  downloadLimitOptions: DropdownOption<AccessDurationValue>[];
}

interface AmountBlockProps {
  title: string;
  value: string;
  feeNote: string;
  placeholder: string;
  field: string;
  updateField: (key: string, value: string) => void;
}

const AmountBlock = ({
  title,
  value,
  feeNote,
  placeholder,
  field,
  updateField,
}: AmountBlockProps) => (
  <Block>
    <SectionTitle>{title}</SectionTitle>
    <ControlWrap>
      <InputField
        value={value || ""}
        onChange={(v) => updateField(field, toText(v))}
        placeholder={placeholder}
        variant={INPUT_VARIANTS.PRIMARY_GRAY}
        inputMode="decimal"
      />
    </ControlWrap>
    <FeeNote>{feeNote}</FeeNote>
  </Block>
);

const SettingsPaymentSection = ({
  t,
  formState,
  updateField,
  downloadLimitOptions,
}: SettingsPaymentSectionProps) => {
  const amountPlaceholder = t("contents.payment.common.enterAmount");
  const feeNote = t("contents.payment.common.feeNote");

  return (
    <>
      {formState.showRentalSection && (
        <AmountBlock
          title={t("contents.payment.collectionRental.title")}
          value={formState.rentalAmount}
          field={PAYMENTS_FORM_FIELDS.RENTAL_AMOUNT}
          placeholder={amountPlaceholder}
          feeNote={feeNote}
          updateField={updateField}
        />
      )}
      {formState.showPurchaseSection && (
        <AmountBlock
          title={t("contents.payment.collectionPurchase.title")}
          value={formState.purchaseAmount}
          field={PAYMENTS_FORM_FIELDS.PURCHASE_AMOUNT}
          placeholder={amountPlaceholder}
          feeNote={feeNote}
          updateField={updateField}
        />
      )}

      <Block>
        <SectionTitle>
          {t("contents.payment.collectionDuration.title")}
        </SectionTitle>

        <SectionText>
          {t("contents.payment.collectionDuration.description")}
        </SectionText>

        <DropdownWrap>
          <SortDropdown
            options={downloadLimitOptions}
            value={formState.maxAccessLimit}
            onChange={(value) =>
              updateField(
                PAYMENTS_FORM_FIELDS.MAX_ACCESS_LIMIT,
                String(value) as AccessDurationValue,
              )
            }
            variant={SORT_DROPDOWN_VARIANT.SURFACE}
            maxWidth="100%"
            renderSelectedLabel={(value, option) => (
              <MonoText $use="Body_Regular">{option?.label ?? value}</MonoText>
            )}
          />
        </DropdownWrap>
      </Block>
    </>
  );
};

export default SettingsPaymentSection;
