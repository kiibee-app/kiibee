"use client";

import { useCallback, useMemo, useState } from "react";
import Image from "next/image";
import { GenericModal } from "@/components/UI/Modals";
import GenericButton from "@/components/UI/GenericButton";
import { MonoText } from "@/components/UI/Monotext";
import { VARIANT } from "@/utils/Constants";
import { MODAL_ALIGN } from "@/utils/ui";
import { useTranslation } from "react-i18next";
import { extractPriceNumber } from "@/utils/contentPricingActions";
import { formatCardExpiry } from "@/utils/formatDate";
import { usePostAPI } from "@/lib/http/api/postApi";
import { useGetAPI } from "@/lib/http/api/getApi";
import { API } from "@/lib/http/api/endpoints";
import { toast } from "react-toastify";
import { SelectedCheckIcon } from "@/assets/icons";
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
  PurchaseModalPaymentMethod,
  PurchaseModalPaymentMethodTitle,
  PurchaseModalPaymentMethodOption,
  PurchaseModalPaymentMethodSelected,
  PurchaseModalPaymentMethodDefaultBadge,
  PurchaseModalPaymentMethodPrimary,
  PurchaseModalPaymentMethodText,
  PurchaseModalPaymentMethodHint,
} from "./styles";
import {
  COUPON_DISCOUNT_PERCENTAGE,
  CouponDiscountType,
  formatSavedCardLabel as formatSavedCardLabelUtil,
} from "@/utils/common";
import DropdownField from "@/components/UI/InputFields/DropdownField";

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

type SavedCard = {
  id: string;
  ePaySubscriptionId: string;
  cardNo: string;
  expireDate: string;
  cardType: string;
  isDefault?: boolean;
};

type SavedCardsResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: SavedCard[] | null;
};

export type PurchaseModalProps = {
  visible: boolean;
  onClose: () => void;
  onPurchase: (couponCode?: string, subscriptionId?: string) => void;
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
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState<
    string | null
  >(null);
  const [prevVisible, setPrevVisible] = useState(visible);

  if (visible !== prevVisible) {
    setPrevVisible(visible);
    setSelectedSubscriptionId(null);
  }

  const verifyCouponMutation = usePostAPI<
    VerifyCouponResponse,
    { code: string; contentId?: string }
  >(API.coupon.verify);

  const savedCardsQuery = useGetAPI<SavedCardsResponse>(
    API.payment.cards,
    undefined,
    {
      enabled: visible,
      retry: 1,
    },
  );

  const savedCards = useMemo(
    () =>
      (savedCardsQuery.data?.data ?? []).filter(
        (card) => card.ePaySubscriptionId,
      ),
    [savedCardsQuery.data?.data],
  );

  const defaultSavedCard = useMemo(
    () => savedCards.find((card) => card.isDefault) ?? savedCards[0] ?? null,
    [savedCards],
  );

  const effectiveSubscriptionId =
    selectedSubscriptionId ?? defaultSavedCard?.ePaySubscriptionId ?? "";
  const isUsingNewCard = selectedSubscriptionId === "";

  const priceNumber = extractPriceNumber(priceLabel);
  const total = priceNumber - discount;

  const formatSavedCardLabel = useCallback(
    (card: SavedCard) =>
      formatSavedCardLabelUtil(
        card.cardNo,
        card.cardType,
        t("singleContent.pricing.savedCard"),
      ),
    [t],
  );

  const dropdownOptions = useMemo(() => {
    return savedCards.map((card) => ({
      value: card.ePaySubscriptionId,
      label: (
        <PurchaseModalPaymentMethodSelected>
          <PurchaseModalPaymentMethodPrimary>
            <MonoText $use="Body_Medium">{formatSavedCardLabel(card)}</MonoText>
            {card.isDefault ? (
              <PurchaseModalPaymentMethodDefaultBadge>
                {t("dashboard.viewerBillings.paymentMethods.defaultBadge")}
              </PurchaseModalPaymentMethodDefaultBadge>
            ) : null}
          </PurchaseModalPaymentMethodPrimary>
          <MonoText $use="Body_Medium">
            {t("singleContent.pricing.expires", {
              date: formatCardExpiry(card.expireDate),
            })}
          </MonoText>
        </PurchaseModalPaymentMethodSelected>
      ),
    }));
  }, [savedCards, formatSavedCardLabel, t]);

  const handleToggleNewCard = useCallback(() => {
    setSelectedSubscriptionId((current) => (current === "" ? null : ""));
  }, []);

  const handlePurchase = () => {
    onPurchase(appliedCode || undefined, effectiveSubscriptionId || undefined);
  };

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
              <Image src={image} alt={imageAlt || title} fill sizes="120px" />
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

      {savedCards.length > 0 ? (
        <PurchaseModalPaymentMethod>
          <PurchaseModalPaymentMethodTitle>
            <MonoText $use="Body_Bold">
              {t("singleContent.pricing.paymentMethod")}
            </MonoText>
          </PurchaseModalPaymentMethodTitle>
          {!isUsingNewCard ? (
            <DropdownField
              value={effectiveSubscriptionId}
              onChange={setSelectedSubscriptionId}
              options={dropdownOptions}
              placeholder={t("singleContent.pricing.selectCard")}
              showSelectedIndicator
            />
          ) : null}
          <PurchaseModalPaymentMethodOption
            type="button"
            $selected={isUsingNewCard}
            onClick={handleToggleNewCard}
          >
            <SelectedCheckIcon selected={isUsingNewCard} size={20} />
            <PurchaseModalPaymentMethodText>
              <MonoText $use="Body_Bold">
                {t("singleContent.pricing.useNewCard")}
              </MonoText>
              <PurchaseModalPaymentMethodHint>
                <MonoText $use="Body_Medium">
                  {t("singleContent.pricing.useNewCardHint")}
                </MonoText>
              </PurchaseModalPaymentMethodHint>
            </PurchaseModalPaymentMethodText>
          </PurchaseModalPaymentMethodOption>
        </PurchaseModalPaymentMethod>
      ) : null}

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
          onClick={handlePurchase}
          disabled={loading}
          isLoading={loading}
        >
          {t("singleContent.pricing.purchase")}
        </GenericButton>
      </PurchaseModalButtonWrapper>
    </GenericModal>
  );
}
