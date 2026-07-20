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
import {
  formatCardExpiry,
  formatDate,
  formatDateSlashShort,
  convertRentDurationHoursToMonths,
} from "@/utils/formatDate";
import { usePostAPI } from "@/lib/http/api/postApi";
import { useGetAPI } from "@/lib/http/api/getApi";
import { API } from "@/lib/http/api/endpoints";
import { toast } from "react-toastify";
import { SelectedCheckIcon, InfoIcon, PlaylistIcon } from "@/assets/icons";
import { useStoredLoginUser } from "@/hooks/auth/useStoredLoginUser";
import {
  PurchaseModalCard,
  PurchaseModalHeading,
  PurchaseModalCardHeader,
  PurchaseModalCardHeaderLabel,
  PurchaseModalCardBody,
  PurchaseModalCardImage,
  PurchaseModalCardInfo,
  PurchaseModalCardBadge,
  PurchaseModalCardTitle,
  PurchaseModalCardCreator,
  PurchaseModalCardPrice,
  PurchaseModalCollectionCard,
  PurchaseModalCollectionCardBody,
  PurchaseModalCollectionRentalHeader,
  PurchaseModalCollectionRentalPeriod,
  PurchaseModalCollectionRentalExpires,
  PurchaseModalCollectionRentalCardBody,
  PurchaseModalCollectionCardImage,
  PurchaseModalCollectionCardBadge,
  PurchaseModalCollectionCardInfo,
  PurchaseModalCollectionMeta,
  PurchaseModalCollectionBenefits,
  PurchaseModalCollectionBenefitsTitle,
  PurchaseModalCollectionBenefitsList,
  PurchaseModalCollectionBenefitsItem,
  PurchaseModalDiscountSection,
  PurchaseModalDiscountLabel,
  PurchaseModalDiscountRow,
  PurchaseModalDiscountInput,
  PurchaseModalCouponError,
  PurchaseModalCouponValidityNotice,
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
  PurchaseModalPaymentIcons,
} from "./styles";
import {
  COUPON_DISCOUNT_PERCENTAGE,
  CouponDiscountType,
  MAX_COUPON_PERCENTAGE_DISCOUNT,
  formatSavedCardLabel as formatSavedCardLabelUtil,
} from "@/utils/common";
import DropdownField from "@/components/UI/InputFields/DropdownField";
import { PAYMENT_ICONS } from "@/utils/paymentIcons";
import COLORS from "@repo/ui/colors";
import { getCouponErrorMessage } from "@/utils/couponErrors";

type VerifyCouponResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    discountType: CouponDiscountType;
    discountValue: number;
    code: string;
    title: string;
    validFrom?: string | null;
    validUntil?: string | null;
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
  onRequireLogin?: () => void;
  isLoggedIn?: boolean;
  title: string;
  image?: string;
  imageAlt?: string;
  creator?: string;
  contentType?: string;
  priceLabel: string;
  accessLabel?: string;
  contentId?: string;
  collectionId?: string;
  elementCount?: number;
  isCollectionPurchase?: boolean;
  rentalDurationHours?: number | null;
  rentalExpiresAt?: string;
  loading?: boolean;
};

export default function PurchaseModal({
  visible,
  onClose,
  onPurchase,
  onRequireLogin,
  isLoggedIn,
  title,
  image,
  imageAlt,
  creator,
  contentType,
  priceLabel,
  accessLabel,
  contentId,
  collectionId,
  elementCount = 0,
  isCollectionPurchase = false,
  rentalDurationHours,
  rentalExpiresAt,
  loading = false,
}: PurchaseModalProps) {
  const { t } = useTranslation();
  const user = useStoredLoginUser();
  const [discountCode, setDiscountCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [couponValidityNotice, setCouponValidityNotice] = useState<
    string | null
  >(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState<
    string | null
  >(null);
  const [prevVisible, setPrevVisible] = useState(visible);

  if (visible !== prevVisible) {
    setPrevVisible(visible);
    setSelectedSubscriptionId(null);

    if (!visible) {
      setDiscountCode("");
      setDiscount(0);
      setAppliedCode(null);
      setCouponValidityNotice(null);
      setCouponError(null);
    }
  }

  const verifyCouponMutation = usePostAPI<
    VerifyCouponResponse,
    { code: string; contentId?: string; collectionId?: string }
  >(API.coupon.verify);

  const savedCardsQuery = useGetAPI<SavedCardsResponse>(
    API.payment.cards,
    undefined,
    {
      enabled: visible && Boolean(user?.id),
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
  const isCollectionRental = Boolean(collectionId && !isCollectionPurchase);
  const isCollectionPricing = isCollectionPurchase || isCollectionRental;
  const displayPrice = isCollectionPricing ? `${priceNumber} kr` : priceLabel;
  const rentalMonths = convertRentDurationHoursToMonths(rentalDurationHours);
  const ModalCard = isCollectionPricing
    ? PurchaseModalCollectionCard
    : PurchaseModalCard;
  const ModalCardBody = isCollectionRental
    ? PurchaseModalCollectionRentalCardBody
    : isCollectionPurchase
      ? PurchaseModalCollectionCardBody
      : PurchaseModalCardBody;
  const ModalCardImage = isCollectionPricing
    ? PurchaseModalCollectionCardImage
    : PurchaseModalCardImage;
  const ModalCardInfo = isCollectionPricing
    ? PurchaseModalCollectionCardInfo
    : PurchaseModalCardInfo;
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
    if (!isLoggedIn && onRequireLogin) {
      onRequireLogin();
      return;
    }
    onPurchase(appliedCode || undefined, effectiveSubscriptionId || undefined);
  };

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) return;

    setCouponError(null);
    setCouponValidityNotice(null);

    try {
      const response = await verifyCouponMutation.mutateAsync({
        code: discountCode.trim(),
        contentId,
        collectionId,
      });

      if (response.success && response.data) {
        const { discountType, discountValue, validUntil } = response.data;
        const calculatedDiscount =
          discountType === COUPON_DISCOUNT_PERCENTAGE
            ? Math.round(
                (priceNumber *
                  Math.min(discountValue, MAX_COUPON_PERCENTAGE_DISCOUNT)) /
                  100,
              )
            : discountValue;
        setDiscount(Math.min(calculatedDiscount, priceNumber));
        setAppliedCode(response.data.code);
        toast.success(t("singleContent.pricing.couponApplied"));

        if (validUntil) {
          setCouponValidityNotice(
            t("singleContent.pricing.couponValidUntil", {
              date: formatDate(validUntil),
            }),
          );
        }
      }
    } catch (error) {
      const apiError = getCouponErrorMessage(error, t);

      setDiscount(0);
      setAppliedCode(null);
      setCouponValidityNotice(null);
      setCouponError(apiError);
      toast.error(apiError);
    }
  };

  const handleRemoveDiscount = () => {
    setDiscountCode("");
    setDiscount(0);
    setAppliedCode(null);
    setCouponValidityNotice(null);
    setCouponError(null);
  };

  return (
    <GenericModal
      visible={visible}
      onClose={onClose}
      size="md"
      width={isCollectionPurchase ? "672px" : undefined}
      padding="0"
      borderRadius="16px"
      showCloseButton={true}
      textAlign={MODAL_ALIGN.START}
      contentMarginBottom={isCollectionPricing ? "0" : undefined}
    >
      {isCollectionPricing ? (
        <PurchaseModalHeading>
          <MonoText $use="H4_Medium">
            {t(
              isCollectionRental
                ? "singleContent.pricing.rentalTitle"
                : "singleContent.pricing.purchaseTitle",
            )}
          </MonoText>
        </PurchaseModalHeading>
      ) : null}

      <ModalCard>
        {!isCollectionPricing ? (
          <PurchaseModalCardHeader>
            <PurchaseModalCardHeaderLabel>
              {accessLabel || t("singleContent.pricing.rental")}
            </PurchaseModalCardHeaderLabel>
          </PurchaseModalCardHeader>
        ) : null}

        {isCollectionRental && rentalMonths > 0 ? (
          <PurchaseModalCollectionRentalHeader>
            <PurchaseModalCollectionRentalPeriod>
              {t("singleContent.pricing.collectionRentalPeriod", {
                count: rentalMonths,
              })}
            </PurchaseModalCollectionRentalPeriod>
            {rentalExpiresAt ? (
              <PurchaseModalCollectionRentalExpires>
                {t("singleContent.pricing.collectionRentalExpires", {
                  date: formatDateSlashShort(rentalExpiresAt),
                })}
              </PurchaseModalCollectionRentalExpires>
            ) : null}
          </PurchaseModalCollectionRentalHeader>
        ) : null}

        <ModalCardBody>
          {image ? (
            <ModalCardImage>
              {isCollectionPricing ? (
                <PurchaseModalCollectionCardBadge>
                  <MonoText $use="Body_Bold">
                    {contentType?.toUpperCase()}
                  </MonoText>
                </PurchaseModalCollectionCardBadge>
              ) : null}
              <Image src={image} alt={imageAlt || title} fill sizes="120px" />
            </ModalCardImage>
          ) : null}

          <ModalCardInfo>
            {isCollectionPricing ? (
              <PurchaseModalCollectionMeta>
                <PlaylistIcon width={14} height={14} />
                <MonoText $use="Body_Bold">
                  {t("collections.elementsCount", { count: elementCount })}
                </MonoText>
              </PurchaseModalCollectionMeta>
            ) : (
              <PurchaseModalCardBadge>
                <MonoText $use="Body_Bold">
                  {contentType?.toUpperCase()}
                </MonoText>
              </PurchaseModalCardBadge>
            )}
            <PurchaseModalCardTitle>
              <MonoText
                $use={isCollectionPricing ? "Body_SemiBold" : "Body_Bold"}
              >
                {title}
              </MonoText>
            </PurchaseModalCardTitle>
            {creator ? (
              <PurchaseModalCardCreator>
                <MonoText $use="Body_Medium">{creator}</MonoText>
              </PurchaseModalCardCreator>
            ) : null}
            <PurchaseModalCardPrice>
              <MonoText
                $use={isCollectionPricing ? "Body_SemiMedium" : "Body_Bold"}
              >
                {displayPrice}
              </MonoText>
            </PurchaseModalCardPrice>
          </ModalCardInfo>
        </ModalCardBody>
      </ModalCard>

      {isCollectionPurchase ? (
        <PurchaseModalCollectionBenefits>
          <PurchaseModalCollectionBenefitsTitle>
            <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY_400}>
              {t("singleContent.pricing.collectionPurchaseTitle")}
            </MonoText>
          </PurchaseModalCollectionBenefitsTitle>
          <PurchaseModalCollectionBenefitsList>
            <PurchaseModalCollectionBenefitsItem>
              <MonoText $use="Body_Medium">
                {t("singleContent.pricing.collectionPurchaseAccess")}
              </MonoText>
            </PurchaseModalCollectionBenefitsItem>
            <PurchaseModalCollectionBenefitsItem>
              <MonoText $use="Body_Medium">
                {t("singleContent.pricing.collectionPurchaseFees")}
              </MonoText>
            </PurchaseModalCollectionBenefitsItem>
          </PurchaseModalCollectionBenefitsList>
        </PurchaseModalCollectionBenefits>
      ) : null}

      {isCollectionRental ? (
        <PurchaseModalCollectionBenefits>
          <PurchaseModalCollectionBenefitsTitle>
            <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY_400}>
              {t("singleContent.pricing.collectionRentalTitle")}
            </MonoText>
          </PurchaseModalCollectionBenefitsTitle>
          <PurchaseModalCollectionBenefitsList>
            <PurchaseModalCollectionBenefitsItem>
              <MonoText $use="Body_Medium">
                {t("singleContent.pricing.collectionRentalStreaming", {
                  count: rentalMonths,
                })}
              </MonoText>
            </PurchaseModalCollectionBenefitsItem>
            <PurchaseModalCollectionBenefitsItem>
              <MonoText $use="Body_Medium">
                {t("singleContent.pricing.collectionPurchaseFees")}
              </MonoText>
            </PurchaseModalCollectionBenefitsItem>
          </PurchaseModalCollectionBenefitsList>
        </PurchaseModalCollectionBenefits>
      ) : null}

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
            onChange={(e) => {
              setDiscountCode(e.target.value);
              if (couponError) setCouponError(null);
            }}
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
        {couponError ? (
          <PurchaseModalCouponError role="alert">
            <InfoIcon size={16} color={COLORS.primary.RED} />
            <MonoText $use="Body_Medium" color={COLORS.primary.RED}>
              {couponError}
            </MonoText>
          </PurchaseModalCouponError>
        ) : null}
        {couponValidityNotice ? (
          <PurchaseModalCouponValidityNotice role="status">
            <InfoIcon size={16} />
            <MonoText $use="Body_Medium" color={COLORS.primary.ORANGE}>
              {couponValidityNotice}
            </MonoText>
          </PurchaseModalCouponValidityNotice>
        ) : null}
      </PurchaseModalDiscountSection>

      <PurchaseModalPriceSummary>
        <PurchaseModalPriceRow>
          <PurchaseModalPriceLabel>
            <MonoText $use="Body_Medium">
              {t("singleContent.pricing.subtotal")}
            </MonoText>
          </PurchaseModalPriceLabel>
          <PurchaseModalPriceValue>
            <MonoText $use="Body_Medium">{displayPrice}</MonoText>
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

      <PurchaseModalPaymentIcons>
        {PAYMENT_ICONS.map((icon) => (
          <Image
            key={icon.alt}
            src={icon.src}
            alt={icon.alt}
            width={34}
            height={23}
          />
        ))}
      </PurchaseModalPaymentIcons>

      <PurchaseModalButtonWrapper>
        <GenericButton
          variant={VARIANT.PRIMARY}
          fullWidth
          onClick={handlePurchase}
          disabled={loading}
          isLoading={loading}
        >
          {isCollectionPurchase
            ? t("singleContent.pricing.buyTotal", { total })
            : isCollectionRental
              ? t("singleContent.pricing.rentTotal", { total })
              : t("singleContent.pricing.purchase")}
        </GenericButton>
      </PurchaseModalButtonWrapper>
    </GenericModal>
  );
}
