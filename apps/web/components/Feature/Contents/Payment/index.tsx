"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import InputField from "@/components/UI/InputFields";
import SortDropdown, {
  type DropdownOption,
} from "@/components/UI/SortDropdown";
import { MonoText } from "@/components/UI/Monotext";
import { INPUT_VARIANTS, SORT_DROPDOWN_VARIANT } from "@/utils/Constants";
import {
  PAYMENT_ADMISSION_VALUE,
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

type AdmissionValue = typeof PAYMENT_ADMISSION_VALUE;

export default function Payment() {
  const { t } = useTranslation();
  const [admissionType, setAdmissionType] = useState<AdmissionValue>(
    PAYMENT_ADMISSION_VALUE,
  );
  const [rentalAmount, setRentalAmount] = useState("");
  const [purchaseAmount, setPurchaseAmount] = useState("");
  const [downloadLimit, setDownloadLimit] = useState<PaymentDownloadLimitValue>(
    PAYMENT_DEFAULT_DOWNLOAD_LIMIT,
  );
  const admissionOptions: DropdownOption<AdmissionValue>[] = useMemo(
    () => [
      {
        label: t("contents.payment.admission.options.payment"),
        value: PAYMENT_ADMISSION_VALUE,
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
              : value,
        })),
      [t],
    );

  const selectedLimit = downloadLimitOptions.find(
    (opt) => opt.value === downloadLimit,
  );

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
              value={admissionType}
              onChange={(value) => setAdmissionType(value as AdmissionValue)}
              variant={SORT_DROPDOWN_VARIANT.SURFACE}
              maxWidth="100%"
            />
          </DropdownWrap>
        </Block>

        <Block>
          <SectionTitle>{t("contents.payment.rental.title")}</SectionTitle>
          <SectionText>{t("contents.payment.rental.description")}</SectionText>
          <ControlWrap>
            <InputField
              value={rentalAmount}
              onChange={(value) => setRentalAmount(value as string)}
              placeholder={t("contents.payment.common.enterAmount")}
              variant={INPUT_VARIANTS.PRIMARY_GRAY}
              inputMode="decimal"
            />
          </ControlWrap>
          <FeeNote>{t("contents.payment.common.feeNote")}</FeeNote>
        </Block>

        <Block>
          <SectionTitle>{t("contents.payment.purchase.title")}</SectionTitle>
          <SectionText>
            {t("contents.payment.purchase.description")}
          </SectionText>
          <ControlWrap>
            <InputField
              value={purchaseAmount}
              onChange={(value) => setPurchaseAmount(value as string)}
              placeholder={t("contents.payment.common.enterAmount")}
              variant={INPUT_VARIANTS.PRIMARY_GRAY}
              inputMode="decimal"
            />
          </ControlWrap>
          <FeeNote>{t("contents.payment.common.feeNote")}</FeeNote>
        </Block>

        <Block>
          <SectionTitle>
            {t("contents.payment.downloadLimit.title")}
          </SectionTitle>
          <SectionText>
            {t("contents.payment.downloadLimit.description")}
          </SectionText>
          <DropdownWrap>
            <SortDropdown
              options={downloadLimitOptions}
              value={downloadLimit}
              onChange={setDownloadLimit}
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
      </PaymentForm>
    </PaymentCard>
  );
}
