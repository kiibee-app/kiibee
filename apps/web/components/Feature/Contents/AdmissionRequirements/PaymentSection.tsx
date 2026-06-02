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

const SettingsPaymentSection = ({
  t,
  formState,
  updateField,
  downloadLimitOptions,
}: SettingsPaymentSectionProps) => {
  return (
    <>
      {formState?.showRentalSection && (
        <Block>
          <SectionTitle>
            {t("contents.payment.collectionRental.title")}
          </SectionTitle>

          <ControlWrap>
            <InputField
              value={formState?.rentalAmount || ""}
              onChange={(v) =>
                updateField(PAYMENTS_FORM_FIELDS.RENTAL_AMOUNT, toText(v))
              }
              placeholder={t("contents.payment.common.enterAmount")}
              variant={INPUT_VARIANTS.PRIMARY_GRAY}
              inputMode="decimal"
            />
          </ControlWrap>

          <FeeNote>{t("contents.payment.common.feeNote")}</FeeNote>
        </Block>
      )}

      {formState?.showPurchaseSection && (
        <Block>
          <SectionTitle>
            {t("contents.payment.collectionPurchase.title")}
          </SectionTitle>

          <ControlWrap>
            <InputField
              value={formState?.purchaseAmount || ""}
              onChange={(v) =>
                updateField(PAYMENTS_FORM_FIELDS.PURCHASE_AMOUNT, toText(v))
              }
              placeholder={t("contents.payment.common.enterAmount")}
              variant={INPUT_VARIANTS.PRIMARY_GRAY}
              inputMode="decimal"
            />
          </ControlWrap>

          <FeeNote>{t("contents.payment.common.feeNote")}</FeeNote>
        </Block>
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
            value={formState?.maxAccessLimit}
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
