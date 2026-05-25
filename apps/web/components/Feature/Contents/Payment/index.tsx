"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import InputField from "@/components/UI/InputFields";
import SortDropdown, {
  type DropdownOption,
} from "@/components/UI/SortDropdown";
import { MonoText } from "@/components/UI/Monotext";
import { INPUT_VARIANTS, SORT_DROPDOWN_VARIANT } from "@/utils/Constants";

import {
  PAYMENT_DEFAULT_DOWNLOAD_LIMIT,
  PAYMENT_DOWNLOAD_LIMIT_VALUES,
  PAYMENT_UNLIMITED_DOWNLOAD_LIMIT,
  type PaymentDownloadLimitValue,
} from "@/utils/common";
import {
  Block,
  ControlWrap,
  DropdownWrap,
  FeeNote,
  PaymentCard,
  PaymentForm,
  SectionText,
  SectionTitle,
} from "./styles";
import { useContentForm } from "../ContentFormContext";

type AdmissionValue = "Payment" | "Free";

export default function Payment() {
  const { t } = useTranslation();
  const { formState, updateField } = useContentForm();

  const admissionOptions: DropdownOption<AdmissionValue>[] = useMemo(
    () => [
      {
        label: t("contents.payment.admission.options.payment"),
        value: "Payment",
      },
      {
        label: t("contents.admissionRequirements.options.free"),
        value: "Free",
      },
    ],
    [t],
  );

  const downloadLimitOptions: DropdownOption<PaymentDownloadLimitValue>[] =
    useMemo(
      () =>
        PAYMENT_DOWNLOAD_LIMIT_VALUES.map((value) => ({
          value,
          label:
            value === PAYMENT_UNLIMITED_DOWNLOAD_LIMIT
              ? t("contents.payment.downloadLimit.options.unlimited")
              : String(value),
        })),
      [t],
    );

  const handleInputChange =
    (field: keyof typeof formState) => (value: string | string[]) => {
      const text = Array.isArray(value) ? value.join("") : value;
      updateField(field, text);
    };

  const selectedLimit = downloadLimitOptions.find(
    (opt) => String(opt.value) === formState.maxDownloadLimit,
  );

  const isFree = formState.admissionRequirement === "Free";

  return (
    <PaymentCard>
      <PaymentForm>
        <Block>
          <SectionTitle>{t("contents.payment.admission.title")}</SectionTitle>
          <SectionText>
            {t("contents.payment.admission.description")}
          </SectionText>
          <DropdownWrap>
            <SortDropdown
              options={admissionOptions}
              value={formState.admissionRequirement as AdmissionValue}
              onChange={(value) =>
                updateField("admissionRequirement", value as AdmissionValue)
              }
              variant={SORT_DROPDOWN_VARIANT.SURFACE}
              maxWidth="100%"
            />
          </DropdownWrap>
        </Block>

        <Block $isFree={isFree}>
          <SectionTitle>{t("contents.payment.rental.title")}</SectionTitle>
          <SectionText>{t("contents.payment.rental.description")}</SectionText>
          <ControlWrap>
            <InputField
              value={formState.rentalAmount}
              onChange={handleInputChange("rentalAmount")}
              placeholder={t("contents.payment.common.enterAmount")}
              variant={INPUT_VARIANTS.PRIMARY_GRAY}
              inputMode="decimal"
              disabled={isFree}
            />
          </ControlWrap>
          <FeeNote>{t("contents.payment.common.feeNote")}</FeeNote>
        </Block>

        <Block $isFree={isFree}>
          <SectionTitle>{t("contents.payment.purchase.title")}</SectionTitle>
          <SectionText>
            {t("contents.payment.purchase.description")}
          </SectionText>
          <ControlWrap>
            <InputField
              value={formState.purchaseAmount}
              onChange={handleInputChange("purchaseAmount")}
              placeholder={t("contents.payment.common.enterAmount")}
              variant={INPUT_VARIANTS.PRIMARY_GRAY}
              inputMode="decimal"
              disabled={isFree}
            />
          </ControlWrap>
          <FeeNote>{t("contents.payment.common.feeNote")}</FeeNote>
        </Block>

        <Block $isFree={isFree}>
          <SectionTitle>
            {t("contents.payment.downloadLimit.title")}
          </SectionTitle>
          <SectionText>
            {t("contents.payment.downloadLimit.description")}
          </SectionText>
          <DropdownWrap>
            <SortDropdown
              options={downloadLimitOptions}
              value={formState.maxDownloadLimit as PaymentDownloadLimitValue}
              onChange={(value) =>
                updateField("maxDownloadLimit", String(value))
              }
              variant={SORT_DROPDOWN_VARIANT.SURFACE}
              maxWidth="100%"
              renderSelectedLabel={() => (
                <MonoText $use="Body_Regular">
                  {selectedLimit?.label ?? PAYMENT_DEFAULT_DOWNLOAD_LIMIT}
                </MonoText>
              )}
            />
          </DropdownWrap>
        </Block>

        <Block>
          <SectionTitle>
            {t("contents.payment.physicalLink.title")}
          </SectionTitle>
          <SectionText>
            {t("contents.payment.physicalLink.description")}
          </SectionText>
          <ControlWrap>
            <InputField
              value={formState.physicalProductLink}
              onChange={handleInputChange("physicalProductLink")}
              placeholder={t("contents.payment.physicalLink.placeholder")}
              width="100%"
              variant={INPUT_VARIANTS.PRIMARY_GRAY}
            />
          </ControlWrap>
        </Block>
      </PaymentForm>
    </PaymentCard>
  );
}
