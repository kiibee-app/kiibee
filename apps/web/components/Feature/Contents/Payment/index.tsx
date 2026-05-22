"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import InputField from "@/components/UI/InputFields";
import DropdownField from "@/components/UI/InputFields/DropdownField";
import { MonoText } from "@/components/UI/Monotext";
import { INPUT_VARIANTS } from "@/utils/Constants";
import COLORS from "@repo/ui/colors";
import { useContentForm } from "../ContentFormContext";
import {
  PanelStack,
  PaymentPanel,
  List,
  ItemRow,
  ItemText,
  ControlWrap,
} from "./styles";
import { FILE_TYPE_CHECKERS } from "@/utils/content";
import { FORMAT_TYPE, FormatType } from "@/utils/types";
import { Directions } from "@/utils/ui";

type Props = {
  uploadedFile?: File | null;
};

export default function PaymentContent({ uploadedFile }: Props) {
  const { t } = useTranslation();
  const { formState, updateField } = useContentForm();

  const getFormatType = (file: File): FormatType => {
    const match = Object.entries(FILE_TYPE_CHECKERS).find(([, check]) =>
      check(file),
    );
    return (match?.[0] as FormatType) ?? FORMAT_TYPE.PDF;
  };

  const contentType = uploadedFile
    ? getFormatType(uploadedFile).toLowerCase()
    : "content";

  const admissionOptions = [
    {
      value: "Payment",
      label: t("contents.payment.admission.payment", "Payment"),
    },
    { value: "Free", label: t("contents.payment.admission.free", "Free") },
  ];

  const downloadLimitOptions = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "5", label: "5" },
    { value: "10", label: "10" },
  ];

  const handleFieldChange =
    (field: keyof typeof formState) => (value: string | string[]) => {
      const text = Array.isArray(value) ? value.join("") : value;
      updateField(field, text);
    };

  const isFree = formState.admissionRequirement === "Free";

  return (
    <PanelStack>
      <PaymentPanel>
        <List>
          <ItemRow>
            <ItemText>
              <MonoText $use="Body_SemiBold">
                {t(
                  "contents.payment.admission.title",
                  "Admission requirements",
                )}
              </MonoText>
              <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY}>
                {t(
                  "contents.admissionRequirements.description",
                  "Consider what type of access your [contentType] should have",
                ).replace("[contentType]", contentType)}
              </MonoText>
            </ItemText>
            <ControlWrap>
              <DropdownField
                options={admissionOptions}
                value={formState.admissionRequirement}
                onChange={(val) => updateField("admissionRequirement", val)}
                arrowDirection={Directions.RIGHT}
              />
            </ControlWrap>
          </ItemRow>

          <ItemRow
            style={{
              opacity: isFree ? 0.5 : 1,
              pointerEvents: isFree ? "none" : "auto",
            }}
          >
            <ItemText>
              <MonoText $use="Body_SemiBold">
                {t("contents.payment.rental.title", "Video rental (Streaming)")}
              </MonoText>
              <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY}>
                {t(
                  "contents.payment.rental.description",
                  "When a video is rented it will be available for 48 hours.",
                )}
              </MonoText>
            </ItemText>
            <ControlWrap>
              <InputField
                value={formState.rentalAmount}
                onChange={handleFieldChange("rentalAmount")}
                placeholder={t(
                  "contents.payment.rental.placeholder",
                  "Enter amount",
                )}
                width="100%"
                variant={INPUT_VARIANTS.PRIMARY_GRAY}
                disabled={isFree}
                helperText={t(
                  "contents.payment.rental.helperText",
                  "Minimum DKK 8, as Kiibee charges DKK 5 in transaction fees",
                )}
              />
            </ControlWrap>
          </ItemRow>

          <ItemRow
            style={{
              opacity: isFree ? 0.5 : 1,
              pointerEvents: isFree ? "none" : "auto",
            }}
          >
            <ItemText>
              <MonoText $use="Body_SemiBold">
                {t(
                  "contents.payment.purchase.title",
                  "Video purchase / download",
                )}
              </MonoText>
              <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY}>
                {t(
                  "contents.payment.purchase.description",
                  "Purchased videos will be available in the user's profile.",
                )}
              </MonoText>
            </ItemText>
            <ControlWrap>
              <InputField
                value={formState.purchaseAmount}
                onChange={handleFieldChange("purchaseAmount")}
                placeholder={t(
                  "contents.payment.purchase.placeholder",
                  "Enter amount",
                )}
                width="100%"
                variant={INPUT_VARIANTS.PRIMARY_GRAY}
                disabled={isFree}
                helperText={t(
                  "contents.payment.purchase.helperText",
                  "Minimum DKK 8, as Kiibee charges DKK 5 in transaction fees",
                )}
              />
            </ControlWrap>
          </ItemRow>

          <ItemRow
            style={{
              opacity: isFree ? 0.5 : 1,
              pointerEvents: isFree ? "none" : "auto",
            }}
          >
            <ItemText>
              <MonoText $use="Body_SemiBold">
                {t(
                  "contents.payment.downloadLimit.title",
                  "Maximum download limit",
                )}
              </MonoText>
              <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY}>
                {t(
                  "contents.payment.downloadLimit.description",
                  "Set how many times a user can download this content (e.g., max 5 downloads per purchase).",
                )}
              </MonoText>
            </ItemText>
            <ControlWrap>
              <DropdownField
                options={downloadLimitOptions}
                value={formState.maxDownloadLimit}
                onChange={(val) => updateField("maxDownloadLimit", val)}
                placeholder="5"
                arrowDirection={Directions.RIGHT}
              />
            </ControlWrap>
          </ItemRow>
        </List>
      </PaymentPanel>

      <PaymentPanel>
        <List>
          <ItemRow>
            <ItemText>
              <MonoText $use="Body_SemiBold">
                {t("contents.payment.physicalLink.title", "Physical product")}
              </MonoText>
              <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY}>
                {t(
                  "contents.payment.physicalLink.description",
                  "If you have a physical version of the product, you can link to a webshop.",
                )}
              </MonoText>
            </ItemText>
            <ControlWrap>
              <InputField
                value={formState.physicalProductLink}
                onChange={handleFieldChange("physicalProductLink")}
                placeholder={t(
                  "contents.payment.physicalLink.placeholder",
                  "Add Product link",
                )}
                width="100%"
                variant={INPUT_VARIANTS.PRIMARY_GRAY}
              />
            </ControlWrap>
          </ItemRow>
        </List>
      </PaymentPanel>
    </PanelStack>
  );
}
