"use client";

import { useState, ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { ACCESS_GATE } from "@/utils/translationKeys";
import {
  GateCard,
  GateConsentText,
  GateFieldGroup,
  GateForm,
  GateInner,
  GateInput,
  GateLabel,
  RequiredAsterisk,
  GateSubmitButton,
  GateTitle,
  GateTitleText,
  GateWrapper,
} from "./styles";

import {
  AccessGateType,
  AccessGateVariant,
  VARIANT,
  VARIANT_CONTENT,
  VARIANT_PAGE,
  TYPE_CODE,
  INPUT_TYPE_TEXT,
  INPUT_TYPE_EMAIL,
  BUTTON_TYPE_SUBMIT,
  AUTOCOMPLETE_OFF,
  AUTOCOMPLETE_NAME,
  AUTOCOMPLETE_EMAIL,
  HTML_ID_CODE,
  HTML_ID_NAME,
  HTML_ID_EMAIL,
} from "@/utils/Constants";
import { useStoredLoginUser } from "@/hooks/auth/useStoredLoginUser";
import {
  PaymentCard,
  PaymentHeader,
  PaymentIcon,
  PaymentOptions,
  PaymentOption,
  PaymentPrice,
  PaymentButton,
  PaymentError,
} from "./PaymentGate.styles";
import { LoginRequiredModal, GenericModal } from "@/components/UI/Modals";
import SuccessModalIcon from "@/components/UI/Modals/SuccessModalIcon";
import { MODAL_ALIGN } from "@/utils/ui";

export type { AccessGateType, AccessGateVariant };

const EMPTY_STRING = "";

type AccessGateProps = {
  type: AccessGateType;
  paymentOptions?: {
    buyPrice?: string | number | null;
    rentPrice?: string | number | null;
    rentDuration?: string | null;
  };
  variant?: AccessGateVariant;
  creatorName?: string;
  onSuccess?: (
    value: string,
    name?: string,
  ) => boolean | void | Promise<boolean | void>;
};

function CodeGate({
  variant,
  onSuccess,
}: {
  variant: AccessGateVariant;
  onSuccess?: (
    value: string,
    name?: string,
  ) => boolean | void | Promise<boolean | void>;
}) {
  const { t } = useTranslation();
  const [code, setCode] = useState(EMPTY_STRING);
  const [showWrongCodeModal, setShowWrongCodeModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const titleKey =
    variant === VARIANT_CONTENT
      ? ACCESS_GATE.contentCodeTitle
      : ACCESS_GATE.pageCodeTitle;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !onSuccess) return;

    setIsSubmitting(true);
    const result = await Promise.resolve(onSuccess(code.trim())).catch(
      () => false,
    );
    setShowWrongCodeModal(result === false);
    setIsSubmitting(false);
  };

  const handleTryAgain = () => {
    setCode(EMPTY_STRING);
    setShowWrongCodeModal(false);
  };

  return (
    <GateCard $variant={variant}>
      <GateTitle>
        <GateTitleText>{t(titleKey)}</GateTitleText>
      </GateTitle>

      <GateForm onSubmit={handleSubmit}>
        <GateFieldGroup>
          <GateLabel htmlFor={HTML_ID_CODE}>
            {t(ACCESS_GATE.codeLabel)}
            <RequiredAsterisk aria-hidden="true">*</RequiredAsterisk>
          </GateLabel>
          <GateInput
            id={HTML_ID_CODE}
            type="password"
            value={code}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setCode(e.target.value)
            }
            placeholder={t(ACCESS_GATE.codePlaceholder)}
            autoComplete={AUTOCOMPLETE_OFF}
          />
        </GateFieldGroup>

        <GateSubmitButton
          type={BUTTON_TYPE_SUBMIT}
          disabled={!code.trim() || isSubmitting}
        >
          {t(ACCESS_GATE.submitCode)}
        </GateSubmitButton>
      </GateForm>

      <GenericModal
        visible={showWrongCodeModal}
        textAlign={MODAL_ALIGN.CENTER}
        title={t(ACCESS_GATE.invalidCodeTitle)}
        message={t(ACCESS_GATE.invalidCodeMessage)}
        cancelLabel={t(ACCESS_GATE.cancel)}
        confirmLabel={t(ACCESS_GATE.tryAgain)}
        onCancel={() => setShowWrongCodeModal(false)}
        onConfirm={handleTryAgain}
        onClose={() => setShowWrongCodeModal(false)}
        buttonRow
        showCloseButton={false}
      />
    </GateCard>
  );
}

function EmailGate({
  variant,
  creatorName,
  onSuccess,
}: {
  variant: AccessGateVariant;
  creatorName?: string;
  onSuccess?: (
    value: string,
    name?: string,
  ) => boolean | void | Promise<boolean | void>;
}) {
  const { t } = useTranslation();
  const [name, setName] = useState(EMPTY_STRING);
  const [email, setEmail] = useState(EMPTY_STRING);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRequestSent, setIsRequestSent] = useState(false);

  const titleKey =
    variant === VARIANT_CONTENT
      ? ACCESS_GATE.contentEmailTitle
      : ACCESS_GATE.pageEmailTitle;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        const result = await onSuccess?.(email.trim(), name.trim());
        if (result !== false && variant === VARIANT_CONTENT)
          setIsRequestSent(true);
      } catch {
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (isRequestSent) {
    return (
      <GateCard $variant={variant}>
        <GateTitle>
          <GateTitleText>{t(ACCESS_GATE.requestSentTitle)}</GateTitleText>
        </GateTitle>
        <GateConsentText>{t(ACCESS_GATE.requestSentMessage)}</GateConsentText>
      </GateCard>
    );
  }

  return (
    <GateCard $variant={variant}>
      <GateTitle>
        <GateTitleText>{t(titleKey)}</GateTitleText>
      </GateTitle>

      <GateForm onSubmit={handleSubmit}>
        <GateFieldGroup>
          <GateLabel htmlFor={HTML_ID_NAME}>
            {t(ACCESS_GATE.nameLabel)}
            <RequiredAsterisk aria-hidden="true">*</RequiredAsterisk>
          </GateLabel>
          <GateInput
            id={HTML_ID_NAME}
            type={INPUT_TYPE_TEXT}
            value={name}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
            placeholder={t(ACCESS_GATE.namePlaceholder)}
            autoComplete={AUTOCOMPLETE_NAME}
          />
        </GateFieldGroup>

        <GateFieldGroup>
          <GateLabel htmlFor={HTML_ID_EMAIL}>
            {t(ACCESS_GATE.emailLabel)}
            <RequiredAsterisk aria-hidden="true">*</RequiredAsterisk>
          </GateLabel>
          <GateInput
            id={HTML_ID_EMAIL}
            type={INPUT_TYPE_EMAIL}
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            placeholder={t(ACCESS_GATE.emailPlaceholder)}
            autoComplete={AUTOCOMPLETE_EMAIL}
            required
          />
        </GateFieldGroup>

        <GateConsentText>
          {t(ACCESS_GATE.consentText, {
            creatorName: creatorName ?? EMPTY_STRING,
          })}
        </GateConsentText>

        <GateSubmitButton
          type={BUTTON_TYPE_SUBMIT}
          disabled={!name.trim() || !email.trim() || isSubmitting}
        >
          {isSubmitting && variant === VARIANT_CONTENT
            ? t(ACCESS_GATE.sendingRequest)
            : t(ACCESS_GATE.submitEmail)}
        </GateSubmitButton>
      </GateForm>
    </GateCard>
  );
}

function PaymentGate({
  options,
  onSuccess,
}: {
  variant: AccessGateVariant;
  options?: AccessGateProps["paymentOptions"];
  onSuccess?: AccessGateProps["onSuccess"];
}) {
  const { t, i18n } = useTranslation();
  const user = useStoredLoginUser();
  const [loginRequired, setLoginRequired] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const money = (value: string | number) =>
    new Intl.NumberFormat(i18n.language === "da" ? "da-DK" : "en-GB", {
      maximumFractionDigits: 2,
    }).format(Number(value));
  const pay = async (itemType: string) => {
    if (!user?.id) {
      setLoginRequired(true);
      return;
    }
    setBusy(true);
    setError("");
    try {
      await onSuccess?.(itemType);
    } catch {
      setError(t("profilePayment.error"));
    } finally {
      setBusy(false);
    }
  };
  return (
    <>
      <PaymentCard aria-label={t("profilePayment.title")}>
        <PaymentHeader>
          <PaymentIcon aria-hidden="true">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <rect x="5" y="10" width="14" height="11" rx="3" />
              <path d="M8 10V7a4 4 0 0 1 8 0v3" />
              <path d="M12 14v3" />
            </svg>
          </PaymentIcon>
          <div>
            <h2>{t("profilePayment.title")}</h2>
            <p>{t("profilePayment.description")}</p>
          </div>
        </PaymentHeader>
        <PaymentOptions>
          {options?.buyPrice != null && (
            <PaymentOption>
              <h3>{t("profilePayment.purchaseLabel")}</h3>
              <PaymentPrice>
                {money(options.buyPrice)} <span>DKK</span>
              </PaymentPrice>
              <p>{t("profilePayment.oneTime")}</p>
              <PaymentButton
                variant={VARIANT.PRIMARY}
                fullWidth
                disabled={busy}
                onClick={() => pay("purchase")}
              >
                {t(
                  busy ? "profilePayment.opening" : "profilePayment.buyAction",
                )}
              </PaymentButton>
            </PaymentOption>
          )}
          {options?.rentPrice != null && (
            <PaymentOption>
              <h3>{t("profilePayment.rentalLabel")}</h3>
              <PaymentPrice>
                {money(options.rentPrice)} <span>DKK</span>
              </PaymentPrice>
              <p>
                {t("profilePayment.duration", {
                  count: Number(options.rentDuration?.split("_")[0] ?? 1),
                })}
              </p>
              <PaymentButton
                variant={VARIANT.SECONDARY}
                fullWidth
                disabled={busy}
                onClick={() => pay("rental")}
              >
                {t(
                  busy ? "profilePayment.opening" : "profilePayment.rentAction",
                )}
              </PaymentButton>
            </PaymentOption>
          )}
        </PaymentOptions>
        {options?.buyPrice == null && options?.rentPrice == null && (
          <p>{t("profilePayment.unavailable")}</p>
        )}
        {error && <PaymentError role="alert">{error}</PaymentError>}
      </PaymentCard>
      <LoginRequiredModal
        visible={loginRequired}
        onClose={() => setLoginRequired(false)}
        message={t("profilePayment.loginMessage")}
      />
    </>
  );
}

export default function AccessGate({
  type,
  paymentOptions,
  variant = VARIANT_PAGE,
  creatorName,
  onSuccess,
}: AccessGateProps) {
  return (
    <GateWrapper $variant={variant}>
      <GateInner $variant={variant}>
        {type === "payment" ? (
          <PaymentGate
            variant={variant}
            options={paymentOptions}
            onSuccess={onSuccess}
          />
        ) : type === TYPE_CODE ? (
          <CodeGate variant={variant} onSuccess={onSuccess} />
        ) : (
          <EmailGate
            variant={variant}
            creatorName={creatorName}
            onSuccess={onSuccess}
          />
        )}
      </GateInner>
    </GateWrapper>
  );
}

export function CreatorAccessGrantedModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const { t } = useTranslation();

  return (
    <GenericModal
      visible={visible}
      icon={<SuccessModalIcon />}
      iconMargin="0 auto 8px"
      textAlign={MODAL_ALIGN.CENTER}
      title={t("accessGate.accessGrantedTitle")}
      message={t("accessGate.accessGrantedMessage")}
      confirmLabel={t("accessGate.viewCollection")}
      onConfirm={onClose}
      onClose={onClose}
      closeOnConfirm={false}
      buttonRow
      size="sm"
      showCloseButton={false}
    />
  );
}
