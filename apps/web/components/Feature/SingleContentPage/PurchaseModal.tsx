"use client";

import { useState } from "react";
import Image from "next/image";
import { GenericModal } from "@/components/UI/Modals";
import GenericButton from "@/components/UI/GenericButton";
import { MonoText } from "@/components/UI/Monotext";
import { VARIANT } from "@/utils/Constants";
import { MODAL_ALIGN } from "@/utils/ui";
import { useTranslation } from "react-i18next";
import { extractPriceNumber } from "@/utils/contentPricingActions";
import { usePostAPI } from "@/lib/http/api/postApi";
import { API } from "@/lib/http/api/endpoints";
import { toast } from "react-toastify";
import {
  PurchaseModalCard,
  PurchaseModalCardHeader,
  PurchaseModalCardHeaderLabel,
  PurchaseModalCardBody,
  PurchaseModalCardImage,
  PurchaseModalCardInfo,
  PurchaseModalCardBadge,
  PurchaseModalCardTitle,
  PurchaseModalCardCreator,
  PurchaseModalCardPrice,
  PurchaseModalDiscountSection,
  PurchaseModalDiscountLabel,
  PurchaseModalDiscountRow,
  PurchaseModalDiscountInput,
  PurchaseModalPriceSummary,
  PurchaseModalPriceRow,
  PurchaseModalPriceRowTotal,
  PurchaseModalPriceLabel,
  PurchaseModalPriceValue,
  PurchaseModalButtonWrapper,
} from "./styles";
import { COUPON_DISCOUNT_PERCENTAGE, CouponDiscountType } from "@/utils/common";

type VerifyCouponResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    discountType: CouponDiscountType;
    discountValue: number;
    code: string;
    title: string;
  };
};

export type PurchaseModalProps = {
  visible: boolean;
  onClose: () => void;
  onPurchase: (couponCode?: string) => void;
  title: string;
  image?: string;
  imageAlt?: string;
  creator?: string;
  contentType?: string;
  priceLabel: string;
  accessLabel?: string;
  contentId?: string;
  loading?: boolean;
};

export default function PurchaseModal({
  visible,
  onClose,
  onPurchase,
  title,
  image,
  imageAlt,
  creator,
  contentType,
  priceLabel,
  accessLabel,
  contentId,
  loading = false,
}: PurchaseModalProps) {
  const { t } = useTranslation();
  const [discountCode, setDiscountCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCode, setAppliedCode] = useState<string | null>(null);

  const verifyCouponMutation = usePostAPI<
    VerifyCouponResponse,
    { code: string; contentId?: string }
  >(API.coupon.verify);

  const priceNumber = extractPriceNumber(priceLabel);
  const total = priceNumber - discount;

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) return;

    try {
      const response = await verifyCouponMutation.mutateAsync({
        code: discountCode.trim(),
        contentId,
      });

      if (response.success && response.data) {
        const { discountType, discountValue } = response.data;
        const calculatedDiscount =
          discountType === COUPON_DISCOUNT_PERCENTAGE
            ? Math.round((priceNumber * discountValue) / 100)
            : discountValue;
        setDiscount(Math.min(calculatedDiscount, priceNumber));
        setAppliedCode(response.data.code);
        toast.success(t("singleContent.pricing.couponApplied"));
      }
    } catch {
      setDiscount(0);
      setAppliedCode(null);
      toast.error(t("singleContent.pricing.couponInvalid"));
    }
  };

  const handleRemoveDiscount = () => {
    setDiscountCode("");
    setDiscount(0);
    setAppliedCode(null);
  };

  return (
    <GenericModal
      visible={visible}
      onClose={onClose}
      size="md"
      padding="0"
      borderRadius="16px"
      showCloseButton={true}
      textAlign={MODAL_ALIGN.START}
    >
      <PurchaseModalCard>
        <PurchaseModalCardHeader>
          <PurchaseModalCardHeaderLabel>
            {accessLabel || t("singleContent.pricing.rental")}
          </PurchaseModalCardHeaderLabel>
        </PurchaseModalCardHeader>

        <PurchaseModalCardBody>
          {image ? (
            <PurchaseModalCardImage>
              <Image src={image} alt={imageAlt || title} fill />
            </PurchaseModalCardImage>
          ) : null}

          <PurchaseModalCardInfo>
            <PurchaseModalCardBadge>
              <MonoText $use="Body_Bold">
                {contentType?.toUpperCase() || "PDF"}
              </MonoText>
            </PurchaseModalCardBadge>
            <PurchaseModalCardTitle>
              <MonoText $use="Body_Bold">{title}</MonoText>
            </PurchaseModalCardTitle>
            {creator ? (
              <PurchaseModalCardCreator>
                <MonoText $use="Body_Medium">{creator}</MonoText>
              </PurchaseModalCardCreator>
            ) : null}
            <PurchaseModalCardPrice>
              <MonoText $use="Body_Bold">{priceLabel}</MonoText>
            </PurchaseModalCardPrice>
          </PurchaseModalCardInfo>
        </PurchaseModalCardBody>
      </PurchaseModalCard>

      <PurchaseModalDiscountSection>
        <PurchaseModalDiscountLabel>
          <MonoText $use="Body_Bold">
            {t("singleContent.pricing.discountCode")}
          </MonoText>
        </PurchaseModalDiscountLabel>
        <PurchaseModalDiscountRow>
          <PurchaseModalDiscountInput
            type="text"
            placeholder={t("singleContent.pricing.enterCode")}
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
            disabled={!!appliedCode}
          />
          {appliedCode ? (
            <GenericButton
              variant={VARIANT.SECONDARY}
              onClick={handleRemoveDiscount}
            >
              {t("singleContent.pricing.remove")}
            </GenericButton>
          ) : (
            <GenericButton
              variant={VARIANT.PRIMARY}
              onClick={handleApplyDiscount}
              disabled={verifyCouponMutation.isPending || !discountCode.trim()}
              isLoading={verifyCouponMutation.isPending}
            >
              {t("singleContent.pricing.apply")}
            </GenericButton>
          )}
        </PurchaseModalDiscountRow>
      </PurchaseModalDiscountSection>

      <PurchaseModalPriceSummary>
        <PurchaseModalPriceRow>
          <PurchaseModalPriceLabel>
            <MonoText $use="Body_Medium">
              {t("singleContent.pricing.subtotal")}
            </MonoText>
          </PurchaseModalPriceLabel>
          <PurchaseModalPriceValue>
            <MonoText $use="Body_Medium">{priceLabel}</MonoText>
          </PurchaseModalPriceValue>
        </PurchaseModalPriceRow>
        <PurchaseModalPriceRow>
          <PurchaseModalPriceLabel>
            <MonoText $use="Body_Medium">
              {t("singleContent.pricing.discount")}
            </MonoText>
          </PurchaseModalPriceLabel>
          <PurchaseModalPriceValue>
            <MonoText $use="Body_Medium">
              {discount > 0 ? `- ${discount} kr` : "0 kr"}
            </MonoText>
          </PurchaseModalPriceValue>
        </PurchaseModalPriceRow>
        <PurchaseModalPriceRowTotal>
          <PurchaseModalPriceLabel>
            <MonoText $use="H5_Medium">
              {t("singleContent.pricing.total")}
            </MonoText>
          </PurchaseModalPriceLabel>
          <PurchaseModalPriceValue>
            <MonoText $use="H5_Medium">{total} kr</MonoText>
          </PurchaseModalPriceValue>
        </PurchaseModalPriceRowTotal>
      </PurchaseModalPriceSummary>

      <PurchaseModalButtonWrapper>
        <GenericButton
          variant={VARIANT.PRIMARY}
          fullWidth
          onClick={() => onPurchase(appliedCode || undefined)}
          disabled={loading}
          isLoading={loading}
        >
          {t("singleContent.pricing.purchase")}
        </GenericButton>
      </PurchaseModalButtonWrapper>
    </GenericModal>
  );
}
