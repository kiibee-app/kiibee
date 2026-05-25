"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import InputField from "@/components/UI/InputFields";
import SortDropdown from "@/components/UI/SortDropdown";
import { MonoText } from "@/components/UI/Monotext";
import {
  INPUT_VARIANTS,
  maxDescriptionCharacters,
  SORT_DROPDOWN_VARIANT,
} from "@/utils/Constants";
import {
  PAYMENT_DEFAULT_DOWNLOAD_LIMIT,
  PAYMENT_DOWNLOAD_LIMIT_VALUES,
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
  HelperFormRow,
  HelperText,
} from "./styles";
import { INPUT_TYPE } from "@/utils/ui";
import TrailerList from "../General/TrailerList";
import {
  ADMISSION_TYPE,
  AdmissionValue,
  getAdmissionOptions,
  getDownloadLimitOptions,
  getPhysicalProductConfig,
  toText,
} from "@/utils/paymentRequirements";

export default function Payment() {
  const { t } = useTranslation();
  const [admissionType, setAdmissionType] = useState<AdmissionValue>(
    ADMISSION_TYPE.PAYMENT,
  );
  const [rentalAmount, setRentalAmount] = useState("");
  const [purchaseAmount, setPurchaseAmount] = useState("");
  const isPayment = admissionType === ADMISSION_TYPE.PAYMENT;
  const isSetPassword = admissionType === ADMISSION_TYPE.SET_PASSWORD;
  const [password, setPassword] = useState("");
  const [downloadLimit, setDownloadLimit] = useState<PaymentDownloadLimitValue>(
    PAYMENT_DEFAULT_DOWNLOAD_LIMIT,
  );
  const downloadLimitOptions = getDownloadLimitOptions(
    t,
    PAYMENT_DOWNLOAD_LIMIT_VALUES,
  );
  const admissionOptions = useMemo(() => getAdmissionOptions(t), [t]);
  const physicalProductConfig = getPhysicalProductConfig(t);

  return (
    <>
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
                onChange={(value) => setAdmissionType(value)}
                variant={SORT_DROPDOWN_VARIANT.SURFACE}
                maxWidth="100%"
              />
            </DropdownWrap>
          </Block>
          {isPayment && (
            <>
              <Block>
                <SectionTitle>
                  {t("contents.payment.rental.title")}
                </SectionTitle>
                <SectionText>
                  {t("contents.payment.rental.description")}
                </SectionText>
                <ControlWrap>
                  <InputField
                    value={rentalAmount}
                    onChange={(value) => setRentalAmount(toText(value))}
                    placeholder={t("contents.payment.common.enterAmount")}
                    variant={INPUT_VARIANTS.PRIMARY_GRAY}
                    inputMode="decimal"
                  />
                </ControlWrap>
                <FeeNote>{t("contents.payment.common.feeNote")}</FeeNote>
              </Block>

              <Block>
                <SectionTitle>
                  {t("contents.payment.purchase.title")}
                </SectionTitle>
                <SectionText>
                  {t("contents.payment.purchase.description")}
                </SectionText>
                <ControlWrap>
                  <InputField
                    value={purchaseAmount}
                    onChange={(value) => setPurchaseAmount(toText(value))}
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
                    renderSelectedLabel={(value, option) => (
                      <MonoText $use="Body_Regular">
                        {option?.label ??
                          value ??
                          PAYMENT_DEFAULT_DOWNLOAD_LIMIT}
                      </MonoText>
                    )}
                  />
                </DropdownWrap>
              </Block>
            </>
          )}
          {isSetPassword && (
            <ControlWrap>
              <InputField
                value={password}
                onChange={(value) =>
                  setPassword(toText(value).slice(0, maxDescriptionCharacters))
                }
                placeholder={t("contents.payment.password.placeholder")}
                variant={INPUT_VARIANTS.PRIMARY_GRAY}
                type={INPUT_TYPE.TEXTAREA}
              />
              <HelperFormRow>
                <HelperText>{t("contents.payment.password.helper")}</HelperText>
                <HelperText>
                  {password.length}/{maxDescriptionCharacters}
                </HelperText>
              </HelperFormRow>
            </ControlWrap>
          )}
        </PaymentForm>
      </PaymentCard>

      <TrailerList config={physicalProductConfig} />
    </>
  );
}
