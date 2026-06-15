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
  GateSubmitButton,
  GateTitle,
  GateTitleText,
  GateWrapper,
} from "./styles";

import {
  AccessGateType,
  AccessGateVariant,
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

export type { AccessGateType, AccessGateVariant };

const TAG_LABEL = "label";
const EMPTY_STRING = "";

type AccessGateProps = {
  type: AccessGateType;
  variant?: AccessGateVariant;
  creatorName?: string;
  onSuccess?: (value: string) => void;
};

function CodeGate({
  variant,
  onSuccess,
}: {
  variant: AccessGateVariant;
  onSuccess?: (value: string) => void;
}) {
  const { t } = useTranslation();
  const [code, setCode] = useState(EMPTY_STRING);

  const titleKey =
    variant === VARIANT_CONTENT
      ? ACCESS_GATE.contentCodeTitle
      : ACCESS_GATE.pageCodeTitle;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) {
      onSuccess?.(code.trim());
    }
  };

  return (
    <GateCard $variant={variant}>
      <GateTitle>
        <GateTitleText>{t(titleKey)}</GateTitleText>
      </GateTitle>

      <GateForm onSubmit={handleSubmit}>
        <GateFieldGroup>
          <GateLabel as={TAG_LABEL} htmlFor={HTML_ID_CODE}>
            {t(ACCESS_GATE.codeLabel)}
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

        <GateSubmitButton type={BUTTON_TYPE_SUBMIT} disabled={!code.trim()}>
          {t(ACCESS_GATE.submitCode)}
        </GateSubmitButton>
      </GateForm>
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
  onSuccess?: (value: string) => void;
}) {
  const { t } = useTranslation();
  const [name, setName] = useState(EMPTY_STRING);
  const [email, setEmail] = useState(EMPTY_STRING);

  const titleKey =
    variant === VARIANT_CONTENT
      ? ACCESS_GATE.contentEmailTitle
      : ACCESS_GATE.pageEmailTitle;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      onSuccess?.(email.trim());
    }
  };

  return (
    <GateCard $variant={variant}>
      <GateTitle>
        <GateTitleText>{t(titleKey)}</GateTitleText>
      </GateTitle>

      <GateForm onSubmit={handleSubmit}>
        <GateFieldGroup>
          <GateLabel as={TAG_LABEL} htmlFor={HTML_ID_NAME}>
            {t(ACCESS_GATE.nameLabel)}
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
          <GateLabel as={TAG_LABEL} htmlFor={HTML_ID_EMAIL}>
            {t(ACCESS_GATE.emailLabel)}
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
          disabled={!name.trim() || !email.trim()}
        >
          {t(ACCESS_GATE.submitEmail)}
        </GateSubmitButton>
      </GateForm>
    </GateCard>
  );
}

export default function AccessGate({
  type,
  variant = VARIANT_PAGE,
  creatorName,
  onSuccess,
}: AccessGateProps) {
  return (
    <GateWrapper $variant={variant}>
      <GateInner $variant={variant}>
        {type === TYPE_CODE ? (
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
