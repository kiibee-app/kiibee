"use client";

import { useCallback, useMemo, useState } from "react";
import Image from "next/image";
import { GenericModal } from "@/components/UI/Modals";
import GenericButton from "@/components/UI/GenericButton";
import { MonoText } from "@/components/UI/Monotext";
import { VARIANT } from "@/utils/Constants";
import { MODAL_ALIGN } from "@/utils/ui";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
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
  InlineAuthWrapper,
  InlineAuthLogo,
  InlineAuthTitle,
  InlineAuthDescription,
  InlineAuthForm,
  InlineAuthOptionsRow,
  InlineAuthRememberLabel,
  InlineAuthForgotLink,
  InlineAuthCheckboxRow,
  InlineAuthCheckbox,
  InlineAuthConsentText,
  InlineAuthBackButtonWrapper,
  InlineAuthFormError,
} from "./styles";
import {
  COUPON_DISCOUNT_PERCENTAGE,
  CouponDiscountType,
  formatSavedCardLabel as formatSavedCardLabelUtil,
} from "@/utils/common";
import DropdownField from "@/components/UI/InputFields/DropdownField";
import { FormProvider } from "react-hook-form";
import FormField from "@/components/UI/FormField";
import { EyeClosedIcon, EyeOpenIcon, BackButtonIcon } from "@/assets/icons";
import { useLoginForm } from "@/hooks/auth/useLoginForm";
import { useViewerSignUpForm } from "@/hooks/auth/useViewerSignUpForm";
import logo from "@/assets/icons/Kiibee_logo_mark_black.svg";
import SafeImage from "@/components/UI/SafeImage";
import { PATHS } from "@/utils/path";

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
  isLoggedIn?: boolean;
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
  isLoggedIn = false,
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
  const [step, setStep] = useState<
    | "PURCHASE"
    | "LOGIN_REQUIRED"
    | "LOGIN"
    | "SIGNUP"
    | "PERSONALIZATION"
    | "CONFIRMATION"
  >("PURCHASE");
  const [prevVisible, setPrevVisible] = useState(visible);

  if (visible !== prevVisible) {
    setPrevVisible(visible);
    setSelectedSubscriptionId(null);
    setStep("PURCHASE");
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
    if (!isLoggedIn) {
      setStep("LOGIN_REQUIRED");
      return;
    }
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
      showCloseButton={
        step === "PURCHASE" ||
        step === "LOGIN_REQUIRED" ||
        step === "CONFIRMATION"
      }
      textAlign={MODAL_ALIGN.START}
    >
      {step === "PURCHASE" && (
        <>
          <PurchaseModalCard>
            <PurchaseModalCardHeader>
              <PurchaseModalCardHeaderLabel>
                {accessLabel || t("singleContent.pricing.rental")}
              </PurchaseModalCardHeaderLabel>
            </PurchaseModalCardHeader>

            <PurchaseModalCardBody>
              {image ? (
                <PurchaseModalCardImage>
                  <Image
                    src={image}
                    alt={imageAlt || title}
                    fill
                    sizes="120px"
                  />
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
                  disabled={
                    verifyCouponMutation.isPending || !discountCode.trim()
                  }
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
        </>
      )}

      {step === "LOGIN_REQUIRED" && (
        <InlineAuthWrapper>
          <InlineAuthTitle>
            {t("createProfileHome.latestUpload.loginModal.title")}
          </InlineAuthTitle>
          <InlineAuthDescription>
            {t("createProfileHome.latestUpload.loginModal.message")}
          </InlineAuthDescription>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              width: "100%",
              marginTop: "1rem",
            }}
          >
            <GenericButton
              variant={VARIANT.PRIMARY}
              fullWidth
              onClick={() => setStep("LOGIN")}
            >
              {t("viewerSignup.login")}
            </GenericButton>
            <GenericButton
              variant={VARIANT.SOFT_OUTLINE}
              fullWidth
              onClick={() => setStep("SIGNUP")}
            >
              {t("createProfileHome.latestUpload.loginModal.confirmLabel")}
            </GenericButton>
          </div>
        </InlineAuthWrapper>
      )}

      {step === "LOGIN" && (
        <InlineLoginForm
          t={t}
          onSuccess={() => setStep("CONFIRMATION")}
          onBack={() => setStep("LOGIN_REQUIRED")}
        />
      )}

      {step === "SIGNUP" && (
        <InlineSignUpForm
          t={t}
          onSuccess={() => setStep("PERSONALIZATION")}
          onBack={() => setStep("LOGIN_REQUIRED")}
        />
      )}

      {step === "PERSONALIZATION" && (
        <InlineAuthWrapper>
          <InlineAuthTitle>
            {t("viewerSignup.preference.title")}
          </InlineAuthTitle>
          <InlineAuthDescription>
            {t("viewerSignup.preference.description")}
          </InlineAuthDescription>
          <GenericButton
            variant={VARIANT.PRIMARY}
            fullWidth
            onClick={() => setStep("CONFIRMATION")}
          >
            {t("viewerSignup.preference.submit")}
          </GenericButton>
        </InlineAuthWrapper>
      )}

      {step === "CONFIRMATION" && (
        <InlineAuthWrapper>
          <InlineAuthTitle>Ready to complete your purchase?</InlineAuthTitle>
          <InlineAuthDescription>
            {
              "You're ready to continue with your purchase. Click below to finalize your order and get access to your content."
            }
          </InlineAuthDescription>

          <PurchaseModalCard style={{ margin: "0 0 1.5rem 0", width: "100%" }}>
            <PurchaseModalCardHeader>
              <PurchaseModalCardHeaderLabel>
                {accessLabel || t("singleContent.pricing.rental")}
              </PurchaseModalCardHeaderLabel>
            </PurchaseModalCardHeader>

            <PurchaseModalCardBody>
              {image ? (
                <PurchaseModalCardImage>
                  <Image
                    src={image}
                    alt={imageAlt || title}
                    fill
                    sizes="120px"
                  />
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

          <GenericButton
            variant={VARIANT.PRIMARY}
            fullWidth
            onClick={() => {
              onPurchase(
                appliedCode || undefined,
                effectiveSubscriptionId || undefined,
              );
            }}
            disabled={loading}
            isLoading={loading}
          >
            Continue
          </GenericButton>
        </InlineAuthWrapper>
      )}
    </GenericModal>
  );
}

function InlineLoginForm({
  onSuccess,
  onBack,
  t,
}: {
  onSuccess: () => void;
  onBack: () => void;
  t: TFunction;
}) {
  const {
    methods,
    isValid,
    isSubmitting,
    formError,
    remember,
    setRemember,
    isPasswordVisible,
    handleFieldChange,
    togglePassword,
    handleSubmit,
  } = useLoginForm({
    onSuccess: () => {
      onSuccess();
    },
  });

  return (
    <InlineAuthWrapper>
      <InlineAuthBackButtonWrapper>
        <button
          type="button"
          onClick={onBack}
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          <BackButtonIcon size={24} />
        </button>
      </InlineAuthBackButtonWrapper>
      <InlineAuthLogo>
        <SafeImage
          src={logo}
          alt="Kiibee Logo"
          width={42}
          height={42}
          priority
        />
      </InlineAuthLogo>
      <InlineAuthTitle>{t("viewerSignup.login")}</InlineAuthTitle>
      <FormProvider {...methods}>
        <InlineAuthForm onSubmit={handleSubmit}>
          <FormField
            id="inline-login-email"
            name="email"
            type="email"
            placeholder={t("authForm.emailLabel")}
            onChange={(nextValue) =>
              handleFieldChange("email", String(nextValue))
            }
            autoComplete="email"
            required
          />
          <FormField
            id="inline-login-password"
            name="password"
            type={isPasswordVisible ? "text" : "password"}
            placeholder={t("authForm.passwordLabel")}
            onChange={(nextValue) =>
              handleFieldChange("password", String(nextValue))
            }
            autoComplete="current-password"
            icon={isPasswordVisible ? <EyeOpenIcon /> : <EyeClosedIcon />}
            onIconClick={togglePassword}
            required
          />
          <InlineAuthOptionsRow>
            <InlineAuthRememberLabel>
              <input
                type="checkbox"
                checked={remember}
                onChange={() => setRemember((prev) => !prev)}
              />
              {t("authForm.remember")}
            </InlineAuthRememberLabel>
          </InlineAuthOptionsRow>
          {formError && <InlineAuthFormError>{formError}</InlineAuthFormError>}
          <GenericButton
            type="submit"
            isLoading={isSubmitting}
            disabled={!isValid}
            fullWidth
          >
            {t("authForm.submit")}
          </GenericButton>
        </InlineAuthForm>
      </FormProvider>
      <InlineAuthForgotLink
        onClick={() => {
          window.open("/auth/forget-password", "_blank");
        }}
        style={{ marginTop: "1rem" }}
      >
        {t("authForm.forgot")}
      </InlineAuthForgotLink>
    </InlineAuthWrapper>
  );
}

function InlineSignUpForm({
  onSuccess,
  onBack,
  t,
}: {
  onSuccess: () => void;
  onBack: () => void;
  t: TFunction;
}) {
  const {
    methods,
    isValid,
    errors,
    isSubmitting,
    formError,
    passwordVisibility,
    updateField,
    togglePassword,
    handleSubmit,
  } = useViewerSignUpForm({
    onSuccess: () => {
      onSuccess();
    },
  });

  const agreedValue = methods.watch("agreed", false);

  return (
    <InlineAuthWrapper>
      <InlineAuthBackButtonWrapper>
        <button
          type="button"
          onClick={onBack}
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          <BackButtonIcon size={24} />
        </button>
      </InlineAuthBackButtonWrapper>
      <InlineAuthLogo>
        <SafeImage
          src={logo}
          alt="Kiibee Logo"
          width={42}
          height={42}
          priority
        />
      </InlineAuthLogo>
      <InlineAuthTitle>{t("viewerSignup.title")}</InlineAuthTitle>
      <FormProvider {...methods}>
        <InlineAuthForm onSubmit={handleSubmit}>
          <FormField
            id="inline-signup-fullname"
            name="fullName"
            type="text"
            placeholder={t("viewerSignup.form.fullNamePlaceholder")}
            onChange={(v) => updateField("fullName", v as string)}
            required
          />
          <FormField
            id="inline-signup-email"
            name="email"
            type="email"
            placeholder={t("viewerSignup.form.emailPlaceholder")}
            onChange={(v) => updateField("email", v as string)}
            required
          />
          <FormField
            id="inline-signup-password"
            name="password"
            type={passwordVisibility?.password ? "text" : "password"}
            placeholder={t("viewerSignup.form.passwordPlaceholder")}
            onChange={(v) => updateField("password", v as string)}
            icon={
              passwordVisibility?.password ? <EyeOpenIcon /> : <EyeClosedIcon />
            }
            onIconClick={() => togglePassword("password")}
            required
          />
          <FormField
            id="inline-signup-confirm-password"
            name="repeatPassword"
            type={passwordVisibility?.repeatPassword ? "text" : "password"}
            placeholder={t("viewerSignup.form.repeatPasswordPlaceholder")}
            onChange={(v) => updateField("repeatPassword", v as string)}
            icon={
              passwordVisibility?.repeatPassword ? (
                <EyeOpenIcon />
              ) : (
                <EyeClosedIcon />
              )
            }
            onIconClick={() => togglePassword("repeatPassword")}
            required
          />
          <InlineAuthCheckboxRow>
            <InlineAuthCheckbox
              id="inline-signup-consent"
              type="checkbox"
              checked={Boolean(agreedValue)}
              onChange={(e) => updateField("agreed", e.target.checked)}
            />
            <InlineAuthConsentText htmlFor="inline-signup-consent">
              {t("viewerSignup.form.consentPrefix")}{" "}
              <a href={PATHS.TERMS} target="_blank" rel="noopener noreferrer">
                {t("viewerSignup.form.terms")}
              </a>{" "}
              {t("viewerSignup.form.and")}{" "}
              <a
                href={PATHS.PRIVACY_POLICY}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("viewerSignup.form.privacy")}
              </a>
            </InlineAuthConsentText>
          </InlineAuthCheckboxRow>

          {(formError || errors.agreed?.message) && (
            <InlineAuthFormError>
              {formError || String(errors.agreed?.message)}
            </InlineAuthFormError>
          )}

          <GenericButton
            type="submit"
            disabled={!isValid}
            isLoading={isSubmitting}
            fullWidth
          >
            {t("viewerSignup.form.submit")}
          </GenericButton>
        </InlineAuthForm>
      </FormProvider>
    </InlineAuthWrapper>
  );
}
